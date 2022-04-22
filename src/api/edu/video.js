import request from '@/utils/request'

const api_name = '/eduservice/video'

export default{
    addVideo(video){
        return request({
            url: api_name + '/addVideo',
            method: 'post',
            data: video
          })
    },
    deleteVideo(id){
        return request({
            url: api_name + `/${id}`,
            method: 'delete'
        })
    },
    getVideoInfo(videoId){
        return request({
            url: api_name + `/getVideoInfo/${videoId}`,
            method: 'get'
        })
    },
    updateVideo(video){
        return request({
            url: api_name + '/updateVideo',
            method: 'post',
            data: video
          })
    },
    removeAiliyunVideo(id){
        return request({
            url : `/eduvod/video/removeVideo/${id}`,
            method: 'delete'
        })
    }
}