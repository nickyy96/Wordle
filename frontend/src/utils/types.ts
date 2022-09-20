export type rowProps = {
    row: string[];
    active: boolean;
}

export type correctProp = {
    count: number;
    index: number[];
}

export type userKnowledge = {
    correct: correctProp;
    present: number;
    count: number;
}