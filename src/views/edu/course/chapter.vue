<template>
    <div class="app-container">
        <h2 style="text-align: center;">发布新课程</h2>
        <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
            <el-step title="填写课程基本信息"/>
            <el-step title="创建课程大纲"/>
            <el-step title="最终发布"/>
        </el-steps>
        <el-button type="text" @click="openChapterDialog()">添加章节</el-button>

        <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
            <el-form :model="chapter" label-width="120px" ref="refForm" :rules="rules" >

                <el-form-item label="章节标题" prop="title">
                    <el-input v-model="chapter.title"/>
                </el-form-item>

                <el-form-item label="章节排序">
                    <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
            <el-form :model="video" label-width="120px" ref="refForm" :rules="rules">
                <el-form-item label="课时标题" prop="title">
                    <el-input v-model="video.title"/>
                </el-form-item>
                <el-form-item label="课时排序">
                    <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
                </el-form-item>
                <el-form-item label="是否免费">
                    <el-radio-group v-model="video.isFree">
                    <el-radio :label="true">免费</el-radio>
                    <el-radio :label="false">默认</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上传视频">
                    <el-upload
                        :on-success="handleVodUploadSuccess"
                        :on-remove="handleVodRemove"
                        :before-remove="beforeVodRemove"
                        :on-exceed="handleUploadExceed"
                        :file-list="fileList"
                        :action="BASE_API+'/eduvod/video/uploadVideo'"
                        :limit="1"
                        class="upload-demo">
                    <el-button size="small" type="primary">上传视频</el-button>
                    <el-tooltip placement="right-end">
                        <div slot="content">最大支持1G，<br>
                            支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                            GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                            MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                            SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                        <i class="el-icon-question"/>
                    </el-tooltip>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
                <el-button :disabled="saveVideoBtnDisabled" type="primary"
                @click="saveOrUpdateVideo">确 定</el-button>
            </div>
        </el-dialog>

        <ul class="chanpterList">
            <li
                v-for="chapter in chapterVideoList"
                :key="chapter.id">
                <p>
                    {{ chapter.title }}

                    <span class="acts">
                        <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
                        <el-button type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                        <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                    </span>
                </p>

                <!-- 视频 -->
                <ul class="chanpterList videoList">
                    <li
                        v-for="video in chapter.children"
                        :key="video.id">
                        <p>{{ video.title }}
                            <span class="acts">
                                <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                            </span>
                        </p>
                    </li>
                </ul>
            </li>
        </ul>
        <el-form label-width="120px">
            <el-form-item>
                <el-button @click="previous">上一步</el-button>
                <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下
                一步</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
    data(){
        return{
            chapter:{
                title: '',
                sort: 0
            },
            video:{
                title: '',
                sort: 0,
                isFree: 0,
                videoSourceId: '',
                videoOriginalName: ''
            },
            fileList: [],//上传文件列表
            BASE_API: process.env.BASE_API, // 接口API地址
            dialogChapterFormVisible: false,
            dialogVideoFormVisible: false,
            saveBtnDisabled:false,
            courseId: '',
            chapterVideoList:[],
            rules:{
                title: [{required: true, message:'标题不能为空', trigger: 'blur'}]
            }
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            if(this.$route.params && this.$route.params.id){
                this.courseId = this.$route.params.id
            }
            this.getChapterVideo()
        },
        beforeVodRemove(file,fileList){
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handleVodRemove(){
            video.removeAiliyunVideo(this.video.videoSourceId).then(response =>{
                this.$message({
                    type:'success',
                    message: '删除视频成功！'
                })
                this.fileList = []
                this.video.videoSourceId = ''
                this.video.videoOriginalName = ''
            })
        },
        //成功回调
        handleVodUploadSuccess(response, file, fileList) {
            this.video.videoSourceId = response.data.videoId
            this.video.videoOriginalName = file.name
        },
        //视图上传多于一个视频
        handleUploadExceed(files, fileList) {
            this.$message.warning('想要重新上传视频，请先删除已上传的视频')
        },
        removeChapter(chapterId){
            this.$confirm('此操作将永久删除章节记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                chapter.deleteChapter(chapterId)
                    .then(response =>{
                        this.$message({
                            type:'success',
                            message: '删除成功！'
                        })
                        this.getChapterVideo()
                    })
            }) 
        },
        addChapter(){
            chapter.addChapter(this.chapter)
                .then(response =>{
                    this.dialogChapterFormVisible = false
                    this.$message({
                        type: 'success',
                        message: '添加章节成功！'
                    })
                    this.getChapterVideo()
                })
        },
        openEditChapter(chapterId){
            this.dialogChapterFormVisible = true
            chapter.getChapterInfo(chapterId)
                .then(response =>{
                    this.chapter = response.data.chapter
                })
        },
        updateChapter(){
            chapter.updateChapter(this.chapter)
                .then(response =>{
                    this.$message({
                        type: 'success',
                        message: '修改章节成功！'
                    })
                    this.dialogChapterFormVisible = false
                    this.getChapterVideo()
                })
        },
        saveOrUpdate(){
            this.chapter.courseId = this.courseId
            this.$refs.refForm.validate((valid) => {
                if (valid) {
                   if(!this.chapter.id){
                        this.addChapter()   
                   }else{
                        this.updateChapter()
                   }
                }
            })
        },
        getChapterVideo(){
            chapter.getAllChapterVideo(this.courseId)
                .then(response =>{
                    this.chapterVideoList = response.data.allChapterVideo
                })
        },
        previous(){
            this.$router.push({path: '/course/info/' + this.courseId})
        },
        next(){
            this.$router.push({path: '/course/publish/' + this.courseId})
        },
        openChapterDialog(){
            this.dialogChapterFormVisible = true;
            this.chapter.id= ''
            this.chapter.title = ''
            this.chapter.sort = ''
        },
        openVideo(chapterId){
            this.dialogVideoFormVisible = true;
            this.video.chapterId = chapterId
            this.video.id = ''
            this.video.title = ''
            this.video.sort = ''
            this.video.free = ''
            this.fileList = []
        },
        saveOrUpdateVideo(){
            this.$refs.refForm.validate((valid) => {
                if (valid) {
                   if(!this.video.id){
                        this.addVideo()   
                   }else{
                        this.updateVideo()
                   }
                }
            })
        },
        addVideo(){
            this.video.courseId = this.courseId
            video.addVideo(this.video)
                .then(response =>{
                    this.$message({
                        type: 'success',
                        message: '添加课时成功！'
                    })
                    this.dialogVideoFormVisible = false
                    this.getChapterVideo()
                    this.video = {}
                    this.fileList = {}
                })
        },
        openEditVideo(videoId){
            this.dialogVideoFormVisible = true
            video.getVideoInfo(videoId).then(response =>{
                this.video = response.data.videoInfo
            })
        },
        updateVideo(){
            video.updateVideo(this.video).then(response =>{
                this.$message({
                    type: 'success',
                    message: '修改课时信息成功！'
                })
                this.dialogVideoFormVisible = false
                this.getChapterVideo()
            })
        },
        removeVideo(videoId){
            this.$confirm('此操作将永久删除课时记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                video.deleteVideo(videoId)
                    .then(response =>{
                        this.$message({
                            type:'success',
                            message: '删除成功！'
                        })
                        this.getChapterVideo()
                    })
            }) 
        }
    }
}
</script>
<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
  position:relative;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
    position:relative;
    z-index: 1;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>