import type { orAnyStr } from "./utils/types";

export type textBoolean = "true" | "false";

type IS24_price = {
    value: number;
    currency: "EUR" | orAnyStr;
    marketingType: "RENT" | orAnyStr;
    priceIntervalType: "MONTH" | orAnyStr;
};

type previewUrl = {
    "@scale": "SCALE_AND_CROP" | "SCALE_MAX" | orAnyStr;
    "@href": string;
};

export type resultlistEntry = {
    "@id": string;
    "@modification": string;
    "@creation": string;
    "@publishDate": string;
    realEstateId: string;
    disabledGrouping: string;
    "resultlist.realEstate": {
        "@id": string;
        title: string;
        address: {
            street?: string;
            houseNumber?: string;
            postcode: string;
            city: string;
            quarter: string;
            wgs84Coordinate?: {
                latitude: number;
                longitude: number;
            };
            preciseHouseNumber?: textBoolean;
            description: {
                text: string;
            };
        };
        "@xsi.type": string;
        streamingVideo: textBoolean;
        spotlightListing: textBoolean;
        privateOffer: textBoolean;
        price: IS24_price;
        numberOfRooms: number;
        livingSpace: number;
        listingType: "S" | "M" | orAnyStr;
        garden: textBoolean;
        floorplan: textBoolean;
        contactDetails: {
            salutation: "FEMALE" | "MALE";
            lastname: string;
            firstname: string;
            company?: string;
            phoneNumber?: string;
        };
        companyWideCustomerId: string;
        calculatedTotalRent: {
            totalRent: IS24_price;
            calculationMode: "SUMMARIZED" | orAnyStr;
        };
        builtInKitchen: textBoolean;
        balcony: textBoolean;
        realtorCompanyName?: string;
        galleryAttachments?: {
            attachment: (
                | {
                      "@xsi.type": "common:Picture";
                      floorplan: textBoolean;
                      titlePicture: textBoolean;
                      urls: {
                          url: previewUrl;
                      }[];
                  }
                | {
                      "@xsi.type": "common:VirtualTour";
                      url: string;
                      previewUrls: {
                          url: previewUrl[];
                      };
                  }
            )[];
        };
        /*
         */
        energyPerformanceCertificate?: textBoolean;
        constructionYear?: number;
        energyEfficiencyClass?: "A" | "B" | "C" | "D" | "E" | "F" | orAnyStr;
        fairPrice?: "GOOD_OFFER" | orAnyStr;
        paywallListing?: {
            active: textBoolean;
        };
    };
    realEstateTags: { tag: string[] };
    hasNewFlag: string;
    attributes: {
        attribute: { label: string; value: string }[];
    }[];
};

export type resultListModel = {
    searchResponseModel: {
        "resultlist.resultlist": {
            paging: {
                next?: {
                    "@xlink.href": string;
                };
                previous?: {
                    "@xlink.href": string;
                };
                current: {
                    "@xlink.href": string;
                };
                pageNumber: number;
                pageSize: number;
                numberOfPages: number;
                numberOfHits: number;
                numberOfListings: number;
            };
            mapMarkers: {};
            resultlistEntries: {
                "@numberOfHits": string;
                "@realEstateType": string;
                resultlistEntry: resultlistEntry[] | resultlistEntry;
            }[];
        };
    };
};
