import videojs from 'video.js'
// just injecting video js into this pointless function. Videojs as a package was not playing nice as a jest module mock. 
export default (id) => {
    return videojs(id);
}   