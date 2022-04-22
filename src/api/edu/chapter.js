import request from '@/utils/request'

const api_name = '/eduservice/chapter'

export default{
    getAllChapterVideo(courseId){
        return request({
            url: api_name + `/getChapterVideo/${courseId}`,
            method: 'get'
          })
    },
    addChapter(chapter){
        return request({
            url: api_name + `/addChapter`,
            method: 'post',
            data: chapter
          })
    },
    getChapterInfo(chapterId){
        return request({
            url: api_name + `/getChapterInfo/${chapterId}`,
            method: 'get'
          })
    },
    updateChapter(chapter){
        return request({
            url: api_name + `/updateChapter`,
            method: 'post',
            data: chapter
          })
    },
    deleteChapter(chapterId){
        return request({
            url: api_name + `/${chapterId}`,
            method: 'delete'
          })
    }
}