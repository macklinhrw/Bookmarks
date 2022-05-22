import { MessageType } from "@src/messages";
import type { Message } from "@src/messages";
import clj from "@clj/clojure.cjs";

//import d from 'datascript'
//
//let schema = {
//  ':bookmark/url': {},
//  ':bookmark/title': {},
//}
//
//let conn = d.create_conn(schema)
//
//const recursivelyUpdateBookmarks = (bookmarks: Bookmark[]) => {
//  bookmarks.forEach((bookmark) => {
//    // we want to keep properties: tag, folder, notes
//    let q = `[:find ?e ?tag ?folder ?notes :in $ ?search :where [?e ":bookmark/chromeId" ?search]
//                                                                [?e ":bookmark/tag" ?tag]
//                                                                [?e ":bookmark/folder" ?folder]
//                                                                [?e ":bookmark/notes" ?notes]]`
//
//    let results = d.q(q, d.db(conn), bookmark.id);
//    if (results.length > 0) {
//      let result = results[0];
//      let id = result[0];
//      let tag = result[1];
//      let folder = result[2];
//      let notes = result[3];
//      if (bookmark.dateGroupModified) {
//        //console.log("folder: " + bookmark.title);
//        d.transact(conn, [
//          [':db/add', id, ':bookmark/title', bookmark.title],
//          [':db/add', id, ':bookmark/chromeId', bookmark.id],
//          [':db/add', id, ':bookmark/chromeDateAdded', bookmark.dateAdded],
//          [':db/add', id, ':bookmark/chromeParentId', bookmark.parentId],
//          [':db/add', id, ':bookmark/isFolder', true],
//        ])
//      } else if (bookmark.url) {
//        d.transact(conn, [
//          [':db/add', id, ':bookmark/url', bookmark.url],
//          [':db/add', id, ':bookmark/title', bookmark.title],
//          [':db/add', id, ':bookmark/chromeId', bookmark.id],
//          [':db/add', id, ':bookmark/chromeDateAdded', bookmark.dateAdded],
//          [':db/add', id, ':bookmark/chromeParentId', bookmark.parentId],
//          [':db/add', id, ':bookmark/tag', tag],
//          [':db/add', id, ':bookmark/folder', folder],
//          [':db/add', id, ':bookmark/notes', notes],
//        ])
//      }
//    } else { // no results, so bookmark doesn't exist -> create a new one
//      populateBookmark(-1, bookmark)
//    }
//    if (bookmark.children) {
//      recursivelyUpdateBookmarks(bookmark.children)
//    }
//  })
//}
//
//const updateFolders = (bookmarks: Bookmark[]) => {
//  let q = `[:find ?e ?title :in $ ?search :where [?e ":bookmark/chromeId" ?search]
//                                                 [?e ":bookmark/tag" ?title]]`
//
//}
//
//let id = 0;
//const recursivelyPopulateBookmarks = (bookmarks: Bookmark[]) => {
//  id = 0;
//  bookmarks.forEach((bookmark) => {
//    id++
//    populateBookmark(id, bookmark);
//    if (bookmark.children) {
//      recursivelyPopulateBookmarks(bookmark.children)
//    }
//  })
//}
//
//const populateBookmark = (id: number, bookmark: Bookmark) => {
//  if (bookmark.dateGroupModified) {
//    //console.log("folder: " + bookmark.title);
//    d.transact(conn, [
//      [':db/add', -1, ':bookmark/title', bookmark.title],
//      [':db/add', -1, ':bookmark/chromeId', bookmark.id],
//      [':db/add', -1, ':bookmark/chromeDateAdded', bookmark.dateAdded],
//      [':db/add', -1, ':bookmark/chromeParentId', bookmark.parentId],
//      [':db/add', -1, ':bookmark/isFolder', true],
//    ])
//  } else if (bookmark.url) {
//    d.transact(conn, [
//      [':db/add', -1, ':bookmark/url', bookmark.url],
//      [':db/add', -1, ':bookmark/title', bookmark.title],
//      [':db/add', -1, ':bookmark/chromeId', bookmark.id],
//      [':db/add', -1, ':bookmark/chromeDateAdded', bookmark.dateAdded],
//      [':db/add', -1, ':bookmark/chromeParentId', bookmark.parentId],
//      [':db/add', -1, ':bookmark/tag', ''],
//      [':db/add', -1, ':bookmark/folder', ''], // TODO: fetch folder title name, updating sounds like a nightmare
//      [':db/add', -1, ':bookmark/notes', ''],
//    ])
//  }
//}
//
//const importBookmarks = (dbExists = false) => {
//  return new Promise(async (resolve) => {
//    console.log('importing from database.ts')
//    await new Promise((resolve) => {
//      if (!dbExists) {
//        chrome.bookmarks.getTree((bookmarks) => {
//          recursivelyPopulateBookmarks(bookmarks[0].children as Bookmark[])
//        })
//        chrome.bookmarks.getTree((bookmarks) => {
//          updateFolders(bookmarks[0].children as Bookmark[])
//        })
//        resolve(true)
//      } else {
//        conn = d.conn_from_datoms(JSON.parse(localStorage['db']))
//        chrome.bookmarks.getTree((bookmarks) => {
//          recursivelyUpdateBookmarks(bookmarks[0].children as Bookmark[])
//        })
//        chrome.bookmarks.getTree((bookmarks) => {
//          updateFolders(bookmarks[0].children as Bookmark[])
//        })
//        resolve(true)
//      }
//    })
//    resolve(conn)
//  })
//}

export interface Bookmark {
  children?: [Bookmark];
  dateAdded: number;
  id?: string;
  index?: number;
  parentId?: number;
  dateGroupModified?: number;
  url?: string;
  title: string;
}

export interface searchResult {
  id: number;
  title: string;
  url: string;
  isFolder: boolean;
}

const recursivelyPopulateBookmarks = (bookmarks: [Bookmark]) => {
  bookmarks.forEach((b) => {
    //console.log(b);
    let parent = b.parentId;
    if (!b.parentId) parent = -1;
    if (b.children) {
      clj.addBookmark(b.title, "", b.id!, b.dateAdded, parent!, true, "", "");
      recursivelyPopulateBookmarks(b.children);
    } else {
      clj.addBookmark(
        b.title,
        b.url!,
        b.id!,
        b.dateAdded,
        parent!,
        false,
        "",
        ""
      );
    }
  });
};

const importBookmarks = () => {
  chrome.bookmarks.getTree((bookmarks) => {
    recursivelyPopulateBookmarks(bookmarks as [Bookmark]);
  });
};

importBookmarks();

const handleQuery = (request: Message, sendResponse: any) => {
  let results = clj.query(request.payload);
  let resultsMap = results.map((result) => {
    let obj: searchResult = {
      id: result[0],
      title: result[1],
      url: result[2],
      isFolder: result[3],
    };
    return obj;
  });
  let response: Message = { type: MessageType.QUERY, payload: resultsMap };
  console.log("Message contents:", request.payload);
  sendResponse(response);
};

chrome.runtime.onMessage.addListener(
  (request: Message, sender, sendResponse) => {
    switch (request.type) {
      case MessageType.QUERY:
        handleQuery(request, sendResponse);
    }
  }
);

export {};
