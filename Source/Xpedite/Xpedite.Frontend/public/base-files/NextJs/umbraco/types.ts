export type RouteStartItem = {
    id: string;
    path: string;
};

export type Route = {
    path: string;
    startItem: RouteStartItem;
};

export type CultureRoute = {
    path: string;
    startItem: RouteStartItem;
};

export type Cultures = {
    [cultureCode: string]: CultureRoute;
};

export type UmbracoNode = {
    id: string;
    contentType: string;
    name: string;
    createDate: string;
    updateDate: string;
    route: Route;
    cultures: Cultures;
};

export type UntypedTypedUmbracoNode = UmbracoNode & {
    properties: any;
};

export type TypedUmbracoNode<T> = UmbracoNode & {
    properties: T;
};

export type BlockList = {
    items: Block<any, any>[]
}

export type Block<TProps, TSettings> = {
    content?: BlockContent<TProps>,
    settings?: BlockContent<TSettings>
}

export type BlockContent<TProps> = {
    contentType: string,
    id: string,
    properties: TProps
}