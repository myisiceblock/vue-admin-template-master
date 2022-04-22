<template>
    <div class="app-container">
        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
            <!-- 所属分类：级联下拉列表 -->
            <!-- 标题 -->
            <el-form-item label="名称">
                <el-input v-model="courseQuery.title" placeholder="课程名称"/>
            </el-form-item>

            <el-form-item label="状态">
                <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
                    <el-option :value="Normal" label="已发布"/>
                    <el-option :value="Draft" label="未发布"/>
                </el-select>
            </el-form-item>

            <!-- 一级分类 -->
            <el-form-item label="类别">
                <el-select
                    v-model="courseQuery.subjectParentId"
                    placeholder="一级分类"
                    @change="subjectLevelOneChanged">
                    <el-option
                        v-for="subject in subjectOneList"
                        :key="subject.id"
                        :label="subject.title"
                        :value="subject.id"/>
                        </el-select>
                <!-- 二级分类 -->
                <el-select v-model="courseQuery.subjectId" placeholder="二级分类">
                    <el-option
                    v-for="subject in subjectTwoList"
                    :key="subject.id"
                    :label="subject.title"
                    :value="subject.id"/>
                </el-select>
            </el-form-item>

            <!-- 讲师 -->
            <el-form-item label="讲师">
                <el-select v-model="courseQuery.teacherId" placeholder="请选择讲师">
                    <el-option
                        v-for="teacher in teacherList"
                        :key="teacher.id"
                        :label="teacher.name"
                        :value="teacher.id"/>
                </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
            <el-button type="default" @click="resetData()">清空</el-button>
        </el-form>

        <el-table
            v-loading="listLoading"
            :data="list"
            element-loading-text="数据加载中"
            border
            fit
            highlight-current-row
            row-class-name="myClassList">
            <el-table-column
                label="序号"
                width="70"
                align="center">
                <template slot-scope="scope">
                 {{ (page - 1) * limit + scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="课程信息" width="470" align="center">
                <template slot-scope="scope">
                    <div class="info">
                        <div class="pic">
                            <img :src="scope.row.cover" alt="scope.row.title" width="150px">
                        </div>
                        <div class="title">
                            <a href="">{{ scope.row.title }}</a>
                            <p>{{ scope.row.lessonNum }} 课时</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="课程状态" width="80">
                <template slot-scope="scope">
                {{ scope.row.status==='Draft'?'未发布':'已发布' }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                {{ scope.row.gmtCreate.substr(0, 10) }}
                </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center">
                <template slot-scope="scope">
                {{ scope.row.gmtModified.substr(0, 10) }}
                </template>
            </el-table-column>
            <el-table-column label="价格" width="100" align="center" >
                <template slot-scope="scope">
                {{ Number(scope.row.price) === 0 ? '免费' :
                '¥' + scope.row.price.toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column prop="buyCount" label="付费学员" width="100" align="center">
                <template slot-scope="scope">
                {{ scope.row.buyCount }}人
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="center">
                <template slot-scope="scope">
                    <router-link :to="'/course/info/'+scope.row.id">
                        <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
                    </router-link>
                    <router-link :to="'/course/chapter/'+scope.row.id">
                        <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
                    </router-link>
                    <el-button type="text" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
            <!-- 分页 -->
        <el-pagination
            :current-page="page"
            :page-size="limit"
            :total="total"
            style="padding: 30px 0; text-align: center;"
            layout="total, prev, pager, next, jumper"
            @current-change="fetchData"
            />
    </div>
</template>
<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'

export default {

  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 10, // 每页记录数
      courseQuery: {
        subjectParentId: '',
        subjectId: '',
        title: '',
        teacherId: '',
        status: ''
      }, // 查询条件
      teacherList: [], // 讲师列表
      subjectOneList: [], // 一级分类列表
      subjectTwoList: [] // 二级分类列表,
    }
  },

  created() { // 当页面加载时获取数据
    this.fetchData()
    // 初始化分类列表
    this.getOneSubject()
    // 获取讲师列表
    this.initTeacherList()
  },

  methods: {
    fetchData(page = 1) { // 调用api层获取数据库中的数据
      console.log('加载列表')
      // 当点击分页组件的切换按钮的时候，会传输一个当前页码的参数page
      // 解决分页无效问题
      this.page = page
      this.listLoading = true
      course.getPageList(this.page, this.limit, this.courseQuery).then(response => {
        // debugger 设置断点调试
          this.list = response.data.rows
          this.total = response.data.total

        this.listLoading = false
      })
    },

    initTeacherList(){
        teacher.getListTeacher()
            .then(response =>{
                this.teacherList = response.data.items
            })
    },

    getOneSubject(){
        subject.getSubjectList()
            .then(response => {
                this.subjectOneList = response.data.list
            })
    },

    subjectLevelOneChanged(value){
        for (let i = 0; i < this.subjectOneList.length; i++) {
            if (this.subjectOneList[i].id === value) {
                this.subjectTwoList = this.subjectOneList[i].children
                this.courseInfo.subjectId = ''
            }
        }
    },
    resetData() {
      this.courseQuery = {}
      this.subjectOneList = []
      this.subjectTwoList = [] // 二级分类列表
      this.fetchData()
    },
    removeDataById(id){
        this.$confirm('是否删除课程里所有内容?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {  //点击确定，执行then方法
                //调用删除的方法
                course.deleteCourse(id)
                    .then(response =>{//删除成功
                        //提示信息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        //回到列表页面
                        this.fetchData()
                })
            })
    }
  }
}
</script>
<style scoped>
.myClassList .info {
    width: 450px;
    overflow: hidden;
}
.myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
}
.myClassList .info .pic a {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.myClassList .info .pic img {
    display: block;
    width: 100%;
}
.myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
}
.myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
}
.myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
}
</style>
