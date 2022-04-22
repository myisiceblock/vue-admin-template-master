import request from '@/utils/request'

const api_name = '/eduservice/subject'

export default{
    getSubjectList(){
        return request({
            url: api_name + '/getAllSubject',
            method: 'get'
          })
    }
}