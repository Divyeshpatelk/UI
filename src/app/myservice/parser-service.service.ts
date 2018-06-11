import { Injectable } from '@angular/core';
import { ConfigService } from '../myservice/config.service';
// const Path = require("path");
// import * as Path  from 'path';

@Injectable()
export class ParserServiceService {
  questionCount = 0;
  outputResultIndex = 0;
  constructor(private configservice: ConfigService) {}
  explainationWithHint;
  outputResult = [
    /* {
      type: "",
      questions: "",
      choices: {
        id:'',
        text:''
      },
      rightAnswer: ""
    } */
  ];

  nonAnsQuetions = [
    /* {
      identifier: "",
      que: [
        {
          qno: "",
          type:'',
          questions: "",
          choices:{
              id:'',
              text:''
          },
          rightAnswer: ""
        }
      ]
    } */
  ];
  nonAnsOptions = [
    /*{
      identifier: "",
      answer: [
        {
          qno: "",
          ans: ""
        }
      ]
    }*/
  ];

  explainationArray = [
    {
      qno: '',
      exp: ''
    }
  ];

  configData = {
    quePattern: '',
    optPattern: '',
    mappingId: '',
    subjectid: '',
    testId: '',
    sectionId: '',
    folderID: '',
    indexid: '',
    accountid: '',
    pastExam: '',
    typeTest: ''
  };

  changeImagePath(readData, answerData) {
    let tempreadData = readData;
    tempreadData = tempreadData.match(/src=("[^\s]*>)/gm);
    const oIMG = `https: // static-assets.pedagogy.study/contents/${this.configData.accountid}/question/${
      this.configData.mappingId
    }/${this.configData.subjectid}/${this.configData.indexid}/${this.configData.folderID}`;

    if (tempreadData) {
      for (let srcIndex = 0; srcIndex < tempreadData.length; srcIndex++) {
        // let imgName = Path.basename(tempreadData[srcIndex]);

        // let imgPath = Path.dirname(tempreadData[srcIndex]);
        const imgName = tempreadData[srcIndex].match(new RegExp(/\/([^/]*\/?$)/gm));
        const imgPath = tempreadData[srcIndex].replace(new RegExp(/\/([^/]*\/?$)/gm), '');
        const fullPath = `src="${oIMG}${imgName}`;

        readData = readData.replace(`${imgPath}${imgName}`, fullPath);
      }
    }
    return readData;
  }

  withoutAnswer(readData, answerData) {
    readData = this.changeImagePath(readData, answerData);
    //  console.log("configData data", this.configData.quePattern);
    let nonAnswerQue = [];
    nonAnswerQue = readData.match(new RegExp(answerData.groupofIdentifier, 'gm'));
    let explaination = [];
    let explainationJson = [];
    if (this.explainationWithHint) {
      explaination = readData.match(this.explainationWithHint);
      explainationJson = this.storeExplaination(explaination);
    }
    explaination = [];
    // main work ............................
    if (nonAnswerQue) {
      for (let n = 0; n < nonAnswerQue.length; n++) {
        if (nonAnswerQue[n].match(/^##qs-([1-9])/gm)) {
          const excePattern = new RegExp(/^##qs-(\d+)/gm);
          const groupMatch = excePattern.exec(nonAnswerQue[n].match(excePattern));
          const ide = groupMatch[1];

          const tempque = nonAnswerQue[n].match(/.*/gm);
          const storeQuestionsSet = [];
          for (; this.outputResultIndex < tempque.length; this.outputResultIndex++) {
            if (!tempque[this.outputResultIndex]) {
              continue;
            }
            // this.nonAnsQuetions;

            while (!tempque[this.outputResultIndex].match(/^##qe-([1-9])/gm)) {
              const que = this.readQuetions(
                tempque,
                new RegExp(this.configData.quePattern),
                new RegExp(this.configData.optPattern)
              );
              //  console.log("Without Questions: ",que.data);
              if (que === null) {
                return null;
              }
              que.data = que.data.replace(/\s+$/, '');
              while (que.data.match(/<br>+$/gm)) {
                const removeBr = new RegExp(/<br>+$/, 'gm');
                que.data = que.data.replace(removeBr, '');
                que.data = que.data.replace(/\s+$/, '');
              }

              const opt = this.readOptions(
                tempque,
                new RegExp(this.configData.optPattern),
                new RegExp(this.configData.quePattern),
                new RegExp(this.configData.optPattern)
              );
              //  console.log("Without Options: ",opt);
              let pastexam;
              if (que && opt) {
                if (this.configData.pastExam === 'true') {
                  pastexam = que.data.match(new RegExp(/\[[^\]]+\][ ]{0,}$/gm));
                  que.data = que.data.replace(new RegExp(/\[[^\]]+\][ ]{0,}$/gm), '');
                }

                const options1 = this.spreadOption(opt, this.configData.optPattern);

                const optionArraywithID = [];
                for (let i = 0; i < options1.length; i++) {
                  optionArraywithID.push({ id: i + 1, text: options1[i] });
                }
                // let remTagofquetions = que.data.replace(new RegExp(this.configData.quePattern), '');
                const temp = {
                  qno: que.id,
                  type: 'single',
                  questions: que.data.replace(new RegExp(this.configData.quePattern), '').trim(),
                  choices: optionArraywithID,
                  ans: [],
                  explaination: '',
                  pastExams: pastexam
                };
                storeQuestionsSet.push(temp);
              } else {
                console.log('que = NULL, Opt = NULL');
                return null;
              }

              if (!tempque[this.outputResultIndex]) {
                break;
              }
            }
            this.outputResultIndex++;
          }
          const allQuestionsData: any = {
            identifier: ide,
            que: storeQuestionsSet
          };
          this.nonAnsQuetions.push(allQuestionsData);
        } else if (nonAnswerQue[n].match(/^##os-([1-9])/gm)) {
          //  console.log("Answer is work: ");
          const excePattern = new RegExp(/^##os-(\d+)/gm);
          const groupMatch = excePattern.exec(nonAnswerQue[n].match(excePattern));
          const ide = groupMatch[1];

          this.outputResultIndex++;
          let multipleOption = '';
          const tempque = nonAnswerQue[n].match(/.*/gm);

          for (; this.outputResultIndex < tempque.length; this.outputResultIndex++) {
            while (!tempque[this.outputResultIndex].match(/^##oe-([1-9])/gm)) {
              multipleOption += tempque[this.outputResultIndex++];
            }

            this.outputResultIndex++;
          }

          if (!multipleOption.match(new RegExp(answerData.idntPattern))) {
            console.log('MultiOption = NULL');
            return null;
          }

          this.storeAnswerForMulichoice(readData, multipleOption, ide, answerData);
        }
        this.outputResultIndex = 0;
      } //  End main For Loop
      // end main work.........................
    } else {
      return null;
    }
    this.addExplaination(explainationJson);
    explainationJson = [];
    this.configservice.questionCount = this.questionCount;
    return this.storeResult(this.nonAnsQuetions, this.configData);
  }
  //  with answer
  withAnswer(readData, ansPattern) {
    if (this.explainationWithHint) {
      readData = readData.replace(this.explainationWithHint, '');
    }

    const result = readData.match(/.*/gm);
    //  console.log("My plaintext: ",readData+"\n");
    //  console.log("My Answer: ",ansPattern);
    while (result.length > this.outputResultIndex) {
      const quetions = this.readQuetions(
        result,
        new RegExp(this.configData.quePattern),
        new RegExp(this.configData.optPattern)
      );

      //  console.log("Questions is : ",quetions.data+"\n");
      const remTagofquetions = '';

      const options = this.readOptions(result, this.configData.optPattern, this.configData.quePattern, ansPattern);

      //  console.log("My Option is: ",options);
      let optionArray = new Array();

      if (quetions !== null && options.length !== 0) {
        quetions.data = quetions.data.replace(/\s+$/, '');
        while (quetions.data.match(/<br>+$/gm)) {
          const removeBr = new RegExp(/<br>+$/, 'gm');
          quetions.data = quetions.data.replace(removeBr, '');
          quetions.data = quetions.data.replace(/\s+$/, '');
        }

        // let remTagofquetions = quetions.data.replace(new RegExp(this.configData.quePattern), '');
        optionArray = this.spreadOption(options, this.configData.optPattern);
        if (optionArray.length === 4) {
          const optionArraywithID = [];
          for (let i = 0; i < optionArray.length; i++) {
            optionArraywithID.push({ id: i + 1, text: optionArray[i] });
          }

          let answer = this.readAnswer(result, ansPattern, this.configData.quePattern);

          if (answer) {
            answer = answer.replace(new RegExp(ansPattern, 'gm'), '');
          }

          //  if (answer !== null) {
          const answerWithoutB = answer;
          this.outputResult.push({
            type: 'SINGLE',
            question: quetions.data.replace(new RegExp(this.configData.quePattern), '').trim(),

            choices: optionArraywithID,
            difficultyLevel: 1,

            rightAnswers: [this.AtoZwithNumber(answerWithoutB)],
            explanation: '',
            courses: [
              {
                mappingId: this.configData.mappingId,
                subjectid: this.configData.subjectid,
                indexid: this.configData.indexid,
                sectionId: this.configData.sectionId
              }
            ],
            testId: this.configData.testId,
            purpose: 'PARTNER_SECTION'
          });
        }
        //  }
      }
    }
    this.configservice.questionCount = this.questionCount;
    return this.outputResult;
  }
  //  with answer

  readAnswer(result, ansPattern, quePattern) {
    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(ansPattern)) {
        return result[this.outputResultIndex];
      } else if (result[this.outputResultIndex].match(quePattern)) {
        //  need to be improve more -->
        break;
      }
    }

    return null;
  }

  storeResult(nonAnsQuetions, configData) {
    const outputResult2 = [];

    for (let i = 0; i < nonAnsQuetions.length; i++) {
      for (let j = 0; j < nonAnsQuetions[i].que.length; j++) {
        outputResult2.push({
          type: 'SINGLE',
          question: nonAnsQuetions[i].que[j].questions,

          choices: nonAnsQuetions[i].que[j].choices,
          difficultyLevel: 1,

          rightAnswers: nonAnsQuetions[i].que[j].ans,
          explanation: nonAnsQuetions[i].que[j].explaination,
          pastExams: nonAnsQuetions[i].que[j].pastExams,
          courses: [
            {
              mappingId: configData.mappingId,
              subjectid: configData.subjectid,
              indexid: configData.indexid,
              sectionId: configData.sectionId
            }
          ],
          testId: configData.testId,
          purpose: 'PARTNER_SECTION'
        });
      }
    }

    if (this.configData.pastExam !== 'true') {
      for (let i = 0; i < outputResult2.length; i++) {
        delete outputResult2[i].pastExams;
      }
    }

    if (this.configData.typeTest !== 'Test') {
      for (let i = 0; i < outputResult2.length; i++) {
        delete outputResult2[i].testId;
        delete outputResult2[i].purpose;
        delete outputResult2[i].courses[0].sectionId;
      }
    }

    return outputResult2;
  }

  readQuetions(result, quePattern, optPattern) {
    let dataOfQuetions = '';

    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(quePattern)) {
        const groupMatch: any = quePattern.exec(result[this.outputResultIndex].match(quePattern));
        const no = groupMatch[1];

        while (!result[this.outputResultIndex].match(optPattern)) {
          if (result[this.outputResultIndex] && result[this.outputResultIndex].length > 0) {
            result[this.outputResultIndex] += '<br>';
          }

          dataOfQuetions += result[this.outputResultIndex];

          this.outputResultIndex++;

          if (this.outputResultIndex >= result.length) {
            break;
          }

          if (!result[this.outputResultIndex]) {
            continue;
          }

          if (result[this.outputResultIndex].match(quePattern)) {
            dataOfQuetions = '';
          }
        }
        this.questionCount++;
        return { id: no, data: dataOfQuetions };
      }
    }
    return null;
  }
  readOptions(result, optPattern, quePattern, ansPattern) {
    let tempArr = '';
    const count = 0;

    for (; this.outputResultIndex < result.length; this.outputResultIndex++) {
      if (result[this.outputResultIndex].match(optPattern)) {
        tempArr += result[this.outputResultIndex];
        tempArr += '<br>';
      } else if (
        result[this.outputResultIndex].match(quePattern) ||
        result[this.outputResultIndex].match(ansPattern) ||
        result[this.outputResultIndex].match(/^##qe-([1-9])/gm)
      ) {
        break;
      } else {
        tempArr += result[this.outputResultIndex];
      }
    }
    return tempArr;
  }

  spreadOption(options, opattern) {
    let splitArray;
    const temp = new Array();
    splitArray = options.split(new RegExp(opattern, 'gm'));
    for (let j = 1; j < splitArray.length; j++) {
      splitArray[j] = splitArray[j].replace(/\s+$/, '');
      if (splitArray[j].match(/<br>+$/gm)) {
        const removeBr = new RegExp(/<br>+$/, 'gm');
        splitArray[j] = splitArray[j].replace(removeBr, '');
      }
      temp.push(splitArray[j].trim());
    }
    //  console.log("Option temp is: ",temp);
    return temp;
  }

  storeAnswerForMulichoice(readData, multipleOption, ide, answerData) {
    let multiOption = [];
    const nonAnswerQue = readData.match(new RegExp(answerData.groupofIdentifier, 'gm'));
    multiOption = multipleOption.match(new RegExp(answerData.idntPattern, 'gm'));

    const t = this.configData.quePattern.replace('^', '');
    console.log('t is :- ', t);
    const multiAnswer = multipleOption.split(new RegExp(t));
    for (let d = 0; d < multiAnswer.length; d++) {
      multiAnswer[d] = multiAnswer[d].replace(new RegExp(/\d.*/));
      if (multiAnswer[d] === 'undefined') {
        multiAnswer.splice(d, 1);
      }
      //  console.log("\nMulti Answer is: ",multiAnswer[d].trim()+"\n Length is: ",multiAnswer.length);
    }
    // let que;

    const storeAnswerSet = [];
    console.log('\nMulti Answer is: ', multiAnswer);
    for (let i = 0; i < multiOption.length; i++) {
      //  console.log("MultiOption is: ",multiOption[i]+"\n");
      const queString = this.configData.quePattern.replace('^', '');
      let excePattern = new RegExp(queString, 'gm');

      let groupMatch = ([] = excePattern.exec(multiOption[i].match(excePattern)));

      const que_no: any = groupMatch[1];
      //  console.log("Questions is: ",que);
      let optString = this.configData.optPattern.replace('[(]', '');
      optString = optString.replace('[)]', '');
      optString = '\\((' + optString + ')\\)';
      //  console.log("option pattern: ",optString);
      excePattern = new RegExp(optString, 'gm');

      // my changes
      let answer = [];
      if (multiAnswer[i + 1]) {
        //  console.log("Multiple answer is 1 :- ",multiAnswer[i]);
        const ansData = multiAnswer[i + 1].trim().split(',');
        //  console.log("length: ",ansData.length);
        answer = [];
        for (let a = 0; a < ansData.length; a++) {
          //  console.log("Multiple answer is 2:- ",ansData[a]);
          groupMatch = excePattern.exec(ansData[a].match(excePattern));
          //  console.log("Group match 0: ",groupMatch[0],"\tGroup match 1: ",groupMatch[1]);
          answer.push(groupMatch[1]);
          //  console.log("Answer is: ",answer);
        }
      }
      // end
      const temp = { qno: que_no, ans: answer };
      //  console.log("storeAnswerForMulichoice: ",temp);
      storeAnswerSet.push(temp);
    }

    const TempStoreAnswer: any = { identifier: ide, answer: storeAnswerSet };

    this.nonAnsOptions.push(TempStoreAnswer);
    //  console.log("json: ", TempStoreAnswer);
    this.storeAnswerTononAnsQuetions();
  }

  storeAnswerTononAnsQuetions() {
    if (this.nonAnsQuetions !== null && this.nonAnsOptions !== null) {
      for (let i = 0; i < this.nonAnsQuetions.length; i++) {
        if (this.nonAnsQuetions[i].identifier === this.nonAnsOptions[0].identifier) {
          for (let j = 0; j < this.nonAnsQuetions[i].que.length; j++) {
            for (let k = 0; k < this.nonAnsOptions[0].answer.length; k++) {
              if (this.nonAnsQuetions[i].que[j].qno === this.nonAnsOptions[0].answer[k].qno) {
                this.nonAnsQuetions[i].que[j].ans = this.AtoZwithNumber(this.nonAnsOptions[0].answer[k].ans);
              }
            }
          }
        }
        break;
      }
    }
    this.nonAnsOptions = [];
  }

  AtoZwithNumber(answer) {
    //  console.log("Work ",answer[0]);
    let ansValue = [];
    for (let i = 0; i < answer.length; i++) {
      if (answer[i] === 'a' || answer[i] === 'A') {
        ansValue.push(1);
      } else if (answer[i] === 'b' || answer[i] === 'B') {
        ansValue.push(2);
      } else if (answer[i] === 'c' || answer[i] === 'C') {
        ansValue.push(3);
      } else if (answer[i] === 'd' || answer[i] === 'D') {
        ansValue.push(4);
      } else if (answer[i] === 'e' || answer[i] === 'E') {
        ansValue.push(5);
      } else if (answer[i] === 'f' || answer[i] === 'F') {
        ansValue.push(6);
      } else if (answer[i] === 'g' || answer[i] === 'G') {
        ansValue.push(7);
      } else if (answer[i] === 'h' || answer[i] === 'H') {
        ansValue.push(8);
      } else if (!isNaN(answer[i])) {
        //  console.log("My Answer if: ",answer[i]);
        ansValue.push(answer[i]);
      } else {
        ansValue = null;
      }
    }

    return ansValue;
  }

  storeExplaination(explaination) {
    let explainationData = [];
    if (explaination) {
      for (let i = 0; i < explaination.length; i++) {
        explainationData = explaination[i].match(/.*/gm);
        //  console.log("explainationData length is :- "+explainationData);
        for (let j = 0; j < explainationData.length; j++) {
          let dataOfQuetions = '';
          if (explainationData[j].match(this.configData.quePattern)) {
            const groupMatch = new RegExp(this.configData.quePattern).exec(
              explainationData[j].match(this.configData.quePattern)
            );
            const no = groupMatch[1];
            //  console.log("not error ",no);
            do {
              dataOfQuetions += explainationData[j];
              //  console.log("Explaination data is ",dataOfQuetions);
              j++;

              if (j >= explainationData.length) {
                break;
              }

              if (!explainationData[j]) {
                continue;
              }

              if (explainationData[j].match(this.configData.quePattern)) {
                break;
              } else {
                dataOfQuetions += '<br>';
              }
            } while (!explainationData[j].match(this.configData.quePattern));
            j--;

            dataOfQuetions = dataOfQuetions.replace(/\s+$/, '');
            while (dataOfQuetions.match(/<br>+$/gm)) {
              const removeBr = new RegExp(/<br>+$/, 'gm');
              dataOfQuetions = dataOfQuetions.replace(removeBr, '');
              dataOfQuetions = dataOfQuetions.replace(/\s+$/, '');
            }
            dataOfQuetions = dataOfQuetions.replace('##ee', '');
            this.explainationArray.push({
              qno: no,
              exp: dataOfQuetions.replace(new RegExp(this.configData.quePattern), '')
            });
          }
        }
      }

      // Display the explaination Array

      /* for(let k=1;k<this.explainationArray.length;k++){
        console.log("Explaination is :- ","qno :- ",this.explainationArray[k].qno,"data :- ",this.explainationArray[k].exp);
    } */
    }
    return this.explainationArray;
  }

  addExplaination(explainationJson) {
    if (this.nonAnsQuetions && explainationJson) {
      for (let i = 0; i < explainationJson.length; i++) {
        for (let k = 0; k < this.nonAnsQuetions.length; k++) {
          for (let j = 0; j < this.nonAnsQuetions[k].que.length; j++) {
            if (this.nonAnsQuetions[k].que[j].qno === explainationJson[i].qno) {
              this.nonAnsQuetions[k].que[j].explaination = explainationJson[i].exp;
            } else {
              //  console.log("error ",explainationJson[i].qno);
            }
          }
        }
      }
    }
  }
} //  End class
