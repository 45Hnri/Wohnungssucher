export type orAnyStr = string & {};

export type flatInfoItem = {
    image: string[];
    title: string;
    company: string | null;
    space: number;
    totalRent?: number;
    rent?: number;
    id: string;
    rooms: number | string;
    quater: string | null;
    street: string | null;
    houseNumber: string | null;
    tags: string[];
    link: string;
};
