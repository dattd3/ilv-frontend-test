const urlInfo = url => {
    try {
        const newUrl = new URL(url)
        if (newUrl) {
            return {
                isValid: true,
                origin: newUrl.origin
            }
        }

        return {
            isValid: false,
            origin: null
        }
    } catch (e) {
        return {
            isValid: false,
            origin: null
        }
    }
}

const prepareNews = (news) => {
    const result = {...news}
    const thumbnailUrl = urlInfo(result.thumbnail)
    if (thumbnailUrl.isValid) {
        return result
    }

    const sourceUrl = urlInfo(result.sourceUrl)
    if (sourceUrl.isValid) {
        result.thumbnail = `${sourceUrl.origin}/${result.thumbnail}`
    }

    return result
}

export { urlInfo, prepareNews }
