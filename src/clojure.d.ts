declare module "@clj/clojure.cjs" {
  export declare const init: () => number;
  export declare const addBookmark: (
    title: string,
    url: string,
    chromeId: string,
    chromeDateAdded: number,
    chromeParentId: number,
    isFolder: boolean,
    tag: string,
    notes: string
  ) => any;
  export declare const removeBookmark: (chromeId: string) => any;
  export declare const query: (query: string) => [any];
  export declare const queryTitle: (title: string) => [any];
  export declare const queryUrl: (url: string) => [any];
}
