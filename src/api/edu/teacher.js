import request from '@/utils/request'

const api_name = '/eduservice/teacher'

export default{
    getTeacherListPage(current,limit,teacherQuery){
        return request({
            url: api_name + `/pageTeacherCondition/${current}/${limit}`,
            method: 'post',
            data : teacherQuery
          })
    },
    deleteTeacherById(id){
        return request({
            url : api_name + `/${id}`,
            method : 'delete'
        })
    },
    addTeacher(teacher){
        return request({
            url : api_name + `/addTeacher`,
            method : 'post',
            data : teacher
        })
    },
    getTeacherInfo(id){
        return request({
            url : api_name + `/getTeacher/${id}`,
            method : 'get'
        })
    },
    updateTeacherInfo(teacher){
        return request({
            url : api_name + `/updateTeacher`,
            method : 'post',
            data : teacher
        })
    },
    getListTeacher() {
        return request({
            url: api_name + '/findAll',
            method: 'get'
        })
    }
}