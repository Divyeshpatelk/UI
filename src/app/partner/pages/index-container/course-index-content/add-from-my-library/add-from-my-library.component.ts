import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LibraryStudyMaterial, StudyMaterial, PreviewContent, Content } from '../../../../../_models';
import { MyLibraryService } from '../../../../services';

@Component({
  selector: 'pdg-add-from-my-library',
  templateUrl: './add-from-my-library.component.html',
  styleUrls: ['./add-from-my-library.component.scss']
})
export class AddFromMyLibraryComponent implements OnInit {
  @Input() addedContents: Content[];
  public contents: StudyMaterial[];
  public isLoading: boolean;
  public submitDisable = true;
  public page: any;
  public searchFilterData: Object;
  public pageCount: number;
  public currentPage: number;
  public pageNumbers: ArrayConstructor[];
  public selectionList: any = {};
  public recordCount = 0;
  constructor(private activeModal: NgbActiveModal, private libraryService: MyLibraryService) {
    this.contents = [];
    this.isLoading = true;
  }

  ngOnInit() {
    this.currentPage = 1;
    this.page = { number: this.currentPage - 1, size: 60, totalElements: 0 };
    this.searchFilterData = { type: 'pdf|video|refvideo', status: 'publish|draft', title: '' };
    this.getStudyMaterialView();
  }

  getStudyMaterialView() {
    this.page.number = this.currentPage - 1;
    const sort = { sortOn: 'lastModifiedDate', order: 'desc' };
    this.libraryService
      .getStudyMaterial(this.page, sort, this.searchFilterData)
      .subscribe((response: LibraryStudyMaterial) => {
        this.isLoading = false;
        const idArr = this.addedContents.map((content) => content.id);
        this.contents = response.content.filter((content) => idArr.indexOf(content._id) === -1);
        if (this.recordCount === 0) {
          this.recordCount = this.contents.length;
        }
        if (this.page.totalElements === 0) {
          this.page.totalElements = response.totalElements;
        }
        if (this.page.size === 0) {
          this.page.size = response.size;
        }
      });
  }

  close() {
    this.activeModal.dismiss('cancelled');
  }

  submit() {
    const previewContents: PreviewContent[] = [];
    for (const id of Object.keys(this.selectionList)) {
      const pContent: PreviewContent = {
        data: {
          description: this.selectionList[id].description,
          duration: 1,
          fileName: this.selectionList[id].cdnUrl,
          fileType: this.selectionList[id].type,
          title: this.selectionList[id].title,
          thumbnailUrl: this.selectionList[id].thumbnailUrl
        },
        contents: [id]
      };
      previewContents.push(pContent);
    }
    this.activeModal.close(previewContents);
  }

  /**
   * method trigger on click of pagination number
   */
  onClickPagination(number) {
    this.currentPage = number;
    this.getStudyMaterialView();
  }

  /**
   * method for set selectionList array with selected checkbox  value
   */
  setSelection(content) {
    if (!this.selectionList[content._id]) {
      this.selectionList[content._id] = content;
    } else {
      delete this.selectionList[content._id];
    }
    if (Object.keys(this.selectionList).length) {
      this.submitDisable = false;
    } else {
      this.submitDisable = true;
    }
  }

  /**
   * This method stand for filtering data from popup according to user input
   * @param value : The value here stand for the data entered by user in text box for filter content from popup
   */
  search(value) {
    if (value || this.searchFilterData['title'] !== '') {
      this.searchFilterData['title'] = value;
      this.page.totalElements = 0;
      this.page.size = 60;
      this.getStudyMaterialView();
    }
  }
}
