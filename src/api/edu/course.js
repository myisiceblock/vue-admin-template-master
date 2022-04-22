import request from '@/utils/request'

const api_name = '/eduservice/course'

export default{
    addCourseInfo(courseInfo){
        return request({
            url: api_name + '/addCourseInfo',
            method: 'post',
            data: courseInfo
          })
    },
    getCourseInfo(id){
        return request({
            url: api_name + `/getCourseInfo/${id}`,
            method: 'get'
          })
    },
    updateCourseInfo(courseInfo){
        return request({
            url: api_name + `/updateCourseInfo`,
            method: 'post',
            data: courseInfo
          })
    },
    getPublishCourseInfo(courseId){
        return request({
            url: api_name + `/getPublishCourseInfo/${courseId}`,
            method: 'get'
          })
    },
    publishCourse(courseId){
        return request({
            url: api_name + `/publishCourse/${courseId}`,
            method: 'post'
          })
    },
    getPageList(page,limit,courseQuery){
        return request({
            url: api_name + `/pageQuery/${page}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },
    deleteCourse(courseId){
        return request({
            url: api_name + `/${courseId}`,
            method: 'delete'
        })
    }
}
