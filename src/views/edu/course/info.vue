<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="提交审核"/>
        </el-steps>

        <el-form label-width="120px" ref="refForm" :model="courseInfo" :rules="rules" >

            <el-form-item label="课程标题" prop="title">
                <el-input v-model="courseInfo.title"
                     placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
            </el-form-item>


            <el-form-item label="课程类别" prop="subjectId">
                <el-select v-model="courseInfo.subjectParentId"
                    placeholder="一级分类"  @change="subjectLevelOneChanged">
                    <el-option
                        v-for="subject in subjectOneList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id" />
                </el-select>
                <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
                    <el-option
                        v-for="subject in subjectTwoList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                </el-select>
            </el-form-item>

            <el-form-item label="课程讲师" prop="teacherId">
                <el-select v-model="courseInfo.teacherId"
                    placeholder="请选择">
                    <el-option v-for="teacher in teacherList"
                            :key="teacher.id"
                            :label="teacher.name"
                            :value="teacher.id" >
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="总课时" prop="lessonNum">
                <el-input-number :min="1" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
            </el-form-item>

            <el-form-item label="课程简介">
                <tinymce :height="300" v-model="courseInfo.description"/>
            </el-form-item>

            <el-form-item label="课程封面">
                <el-upload
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :action="BASE_API+'/eduoss/fileoss'"
                    class="avatar-uploader">
                    <img :src="courseInfo.cover" style="weight:150px;height:150px">
                </el-upload>
            </el-form-item>

            <el-form-item label="课程价格">
                <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
            </el-form-item>

            <el-form-item >
                <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {
    components: { Tinymce },
    data(){
        return{
            courseInfo:{
                teacherId: '',
                title: '',
                subjectId: '',
                teacherId: '',
                lessonNum: 2,
                description: '',
                cover: process.env.OSS_PATH + '/cover/default.jpeg',
                price: 0,
                subjectId: '',
                subjectParentId: ''
            },
            saveBtnDisabled:false,
            teacherList: [],
            subjectOneList: [],
            subjectTwoList: [],
            BASE_API: process.env.BASE_API,
            courseId: '',
            rules: {
                title: [{required: true, message:'标题不能为空！', trigger: 'blur'}],
                subjectId: [{required: true, message:'课程类别不能为空！', trigger: 'change'}],
                teacherId: [{required: true, message:'课程讲师不能为空！', trigger: 'change'}]
            }
        }
    },
    created(){
        this.init()
    },
    watch:{
      $route(to,from){
          this.init()
      }
    },
    methods:{
        init(){
            if(this.$route.params && this.$route.params.id){
                this.courseId = this.$route.params.id
                this.getCourseInfo()
            }else{
                this.initTeacherList()
                this.getOneSubject()
                this.courseInfo.teacherId= ''
                this.courseInfo.title= ''
                this.courseInfo.subjectId= ''
                this.courseInfo.teacherId= ''
                this.courseInfo.lessonNum= 2
                this.courseInfo.description= ''
                this.courseInfo.cover= process.env.OSS_PATH + '/cover/default.jpeg'
                this.courseInfo.price= 0
                this.courseInfo.subjectId= ''
                this.courseInfo.subjectParentId= ''
            }
        },
        getCourseInfo(){
            course.getCourseInfo(this.courseId)
                .then(response =>{
                    this.courseInfo = response.data.courseInfo
                    subject.getSubjectList()
                        .then(response =>{
                            this.subjectOneList = response.data.list
                            for(let i =0; i < this.subjectOneList.length; i++ ){
                                if(this.courseInfo.subjectParentId === this.subjectOneList[i].id){
                                    this.subjectTwoList = this.subjectOneList[i].children
                                }
                            }
                        })
                        this.initTeacherList()
                })
        },
        handleAvatarSuccess(res,file){
            this.courseInfo.cover = res.data.url
        },
        beforeAvatarUpload(file){
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        subjectLevelOneChanged(value){
            for (let i = 0; i < this.subjectOneList.length; i++) {
                if (this.subjectOneList[i].id === value) {
                    this.subjectTwoList = this.subjectOneList[i].children
                    this.courseInfo.subjectId = ''
                }
            }
        },
        getOneSubject(){
            subject.getSubjectList()
                .then(response => {
                    this.subjectOneList = response.data.list
                })
        },
        initTeacherList(){
            teacher.getListTeacher()
                .then(response =>{
                    this.teacherList = response.data.items
                })
        },
        saveOrUpdate(){
            this.$refs.refForm.validate((valid) => {
                if (valid) {
                    if(this.courseId){
                        this.updateCourseAndDescription()
                    }else{
                        this.addCourseAndDescription()
                    }
                }
            })
        },
        addCourseAndDescription(){
            course.addCourseInfo(this.courseInfo)
                .then(response =>{
                    this.$message({
                        type: 'success',
                        message: '添加课程信息成功!'
                    });
                    this.$router.push({path:'/course/chapter/'+response.data.courseId})
              })
        },
        updateCourseAndDescription(){
            course.updateCourseInfo(this.courseInfo)
                .then(response =>{
                    this.$message({
                        type: 'success',
                        message: '修改课程信息成功!'
                    });
                    this.$router.push({path:'/course/chapter/' + this.courseId})
                })
        }
    }
}
</script>
<style scoped>
    .tinymce-container {
        line-height: 29px;
    }
</style>
