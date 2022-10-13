<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" title="黑马头条">
      <van-icon
        slot="left"
        name="arrow-left"
        @click="$router.back()"
      ></van-icon>
    </van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div v-else-if="article.content" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <followuser
            class="follow-btn"
            :isfollowed="article.is_followed"
            :userid="article.aut_id"
            @IsFollowed="changeFollowed"
          ></followuser>
          <!-- <van-button
            v-if="article.is_followed"
            class="follow-btn"
            round
            size="small"
            :loading = "followLoading"
            @click="onFollow"
            >已关注</van-button
          >
          <van-button
            v-else
            class="follow-btn"
            type="info"
            color="#3296fa"
            round
            size="small"
            icon="plus"
            :loading = "followLoading"
            @click="onFollow"
            >关注</van-button>
          -->
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!-- 文章评论列表 -->
        <commentList
          :commentID="article.art_id"
          @getTotalData="setTotalData"
          :list="commentList"
          @reply-click = "onReplyClick"
        ></commentList>

        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostCommentShow = true"
            >写评论</van-button
          >
          <!-- 评论数量 -->
          <van-icon name="comment-o" :badge="totalCount" color="#777" />
          <!-- 收藏按钮 <van-icon color="#777" name="star-o" /> -->
          <collectArticle
            class="btn-item"
            v-model="article.is_collected"
            :articleID="article.art_id"
          />
          <!-- 点赞按钮 <van-icon color="#777" name="good-job-o" /> -->
          <likeArticle
            :attitude="article.attitude"
            :articleID="article.art_id"
            @changeAttitude="changeCount"
          />
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 发布评论弹出层 -->
        <van-popup v-model="isPostCommentShow" position="bottom">
          <commentPost
            :target="article.art_id"
            @post-success="OnPostSuccess"
          ></commentPost>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errorStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 评论回复 -->
    <!-- 弹出层是懒加载的, 只有第一次展示的时候会渲染里面的内容
         所以会出现评论列表内的评论一直是第一次渲染的内容,不会重复获取
         可以通过v-if, 去控制渲染节点 true->渲染节点 false->销毁节点
    -->
    <van-popup v-model="isReplayShow" position="bottom" style="height: 100%">
      <commentReply v-if="isReplayShow" :comment = "currentComment" @click-close = "isReplayShow = false"></commentReply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import followuser from '@/components/follow-user'
import collectArticle from '@/components/collect-article'
import likeArticle from '@/components/like-article'
import commentList from './components/commentList.vue'
import commentPost from './components/comment-post.vue'
import commentReply from './components/comment-reply.vue'
export default {
  name: 'Article',
  // 给所有的后代组件提供数据
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  data () {
    return {
      // 文章详情
      article: {},
      // 加载中的loading状态
      loading: true,
      // 失败的状态码
      errorStatus: 0,
      // 评论数量
      totalCount: 0,
      // 控制评论弹出层显示/隐藏
      isPostCommentShow: false,
      commentList: [],
      // 评论回复弹出层
      isReplayShow: false,
      // 点击回复评论用到的数据
      currentComment: {}
    }
  },
  props: {
    // 路由传递过来的
    // 开启props 传递路由参数, 把路由参数传到组件对应的props属性里
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {
    followuser,
    collectArticle,
    likeArticle,
    commentList,
    commentPost,
    commentReply
  },
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        this.article = data.data
        // 图片预览
        // 因为视图更新操作不是立即产生的所以要一点点延迟
        setTimeout(() => {
          this.previewImage()
        }, 1)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.errorStatus = 404
        }
        this.$toast('获取文章详情失败, 请重试')
        console.log(error)
      }
      // 无论请求成功失败都关闭loading加载
      this.loading = false
    },
    previewImage () {
      // 得到所有image节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // img的地址
      const imagesSrc = []
      imgs.forEach((img, index) => {
        imagesSrc.push(img.src)
        // console.log(imagesSrc)
        // 给遍历出的每一项绑定点击事件, 同时添加ImagePreview组件
        img.onclick = () => {
          ImagePreview({
            // 浏览的图片地址数组
            images: imagesSrc,
            // 起始位置, 从0开始
            startPosition: index
          })
        }
      })
    },
    changeFollowed () {
      this.article.is_followed = !this.article.is_followed
    },
    changeCount (status) {
      this.article.attitude = status
    },
    setTotalData (data) {
      this.totalCount = data.total_count
    },
    OnPostSuccess (data) {
      // 关闭弹出层
      // 将发布的内容显示到列表顶部
      this.isPostCommentShow = false
      // console.log(data)
      this.commentList.unshift(data.new_obj)
    },
    onReplyClick (comment) {
      // console.log(comment)
      this.currentComment = comment
      // 显示评论回复弹出层
      this.isReplayShow = true
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .page-nav-bar {
    position: fixed;
    left: 0;
    right: 0;
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    /deep/ .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777;
    }
    .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
