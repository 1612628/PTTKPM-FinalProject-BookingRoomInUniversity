export const isLoading = page => remoteData => {
    return remoteData.isLoading || (remoteData.currentPage && remoteData.currentPage !== page)
}
export const isFailed = remoteData => {
    return !remoteData.data || remoteData.error
}