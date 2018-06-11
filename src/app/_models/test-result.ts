
export interface TestHistory {
    content: TestRecord [];
    totalElements: number;
    numberOfElements: number;
}

export interface TestRecord {
    lastModifiedDate?: string;
    historyData: any;
    status: string;
    duration?: number;
    score?: number;
    testName?: string;
    partnerTestId?: string;
    showResultToStudents?: boolean;
    startTime?: string;
    endTime?: string;
    currentTime?: number;
    messageForResultDisplay?: any;
}
