const SERVER_HOST_http = "http://localhost:8000"
const SERVER_HOST_ws = "ws://localhost:8000"
export const API = {
    pagelist: SERVER_HOST_http+"/api/pages",
    pagestatus: SERVER_HOST_http+"/api/pagestatus",
    pagedoc: SERVER_HOST_http+"/api/pagesdoc",
    pagerevision: SERVER_HOST_http+"/api/pagerevision",
    contributor: SERVER_HOST_http+"/api/contributor",
    pullFormatPage: SERVER_HOST_http+"/api/pullFormatPage",
    updatepage: SERVER_HOST_http+"/api/updatepage",
}

export const WS = {
    pullPageStatus: SERVER_HOST_ws+"/pullPageStatus"
}

export const WikiSite = {
    baseUrl: "https://oxygennotincluded.fandom.com/zh/wiki/",
}