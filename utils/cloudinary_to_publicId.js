const toPublicId = (string) => {
    let split = string.split("/")
    let publicId = (split[split.length - 2] + "/" + split[split.length - 1]).split(".")[0]
    return publicId
}

export default toPublicId