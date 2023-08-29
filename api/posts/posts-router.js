// implement your posts router here
const Posts=require('./posts-model')
const express=require('express')
const router=express.Router()

router.get('/',(req,res)=>{

   
    Posts.find()
        .then(post=>{
            res.status(200).json(post)
            //throw new Error('ouch')
        })
        .catch(err=>{
            
            res.status(500).json({ 
                message: "The posts information could not be retrieved" ,
                err:err.message,
                stack:err.stack
            })
        })
})

//---------------------------------solution 1----------------------------
// router.get('/:id',(req,res)=>{
//     Posts.findById(req.params.id)
//          .then(post=>{
//             if (post){
//                 res.status(200).json(post)
//             }else{
//                 res.status(404).json({ message: "The post with the specified ID does not exist" })
//             }
//          })
//          .catch(err=>{
//             console.log(err);
//              res.status(500).json({ message: "The post information could not be retrieved" })
//          })

// })
//---------------------------------solution 2----------------------------
router.get('/:id', async(req, res) => {
    try{
        const post=await Posts.findById(req.params.id)
        if (!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }else{
            res.status(200).json(post)
        }
    }catch(err){
        res.status(500).json({
            message: "The posts information could not be retrieved",
            err: err.message,
            stack: err.stack
        })


    }
   

})

// .then(({id}) => {
//        return Posts.findById(id)
//  })
//上诉code 是因为经过database 处理之后得到的内容是{id:10},返回的是一个只含有ID的object。
//所以，以{id}的形式只得到新增的item 的ID值，然后通过findById（）返回一个这个新item的整体
//return 使得返回的new whole item 直接传递到下面的then（）继续异步处理
router.post('/',(req,res)=>{
    const {title,contents}=req.body
    if (!title||!contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        
        Posts.insert({ title, contents })
            .then(({id}) => {
                return Posts.findById(id)       
         })
            .then(post=>{
                res.status(201).json(post)
            })
            .catch(err=>{
                res.status(500).json({
                     message: "There was an error while saving the post to the database",
                    err: err.message,
                    stack: err.stack })
            })
    }
    

})
//---------------------------------solution 1----------------------------
// router.delete('/:id',(req,res)=>{
//     Posts.findById(req.params.id)
//          .then(post=>{
//              if (!post) {
//                  res.status(404).json({ message: "The post with the specified ID does not exist" })
//              } else {
//                 Posts.remove(req.params.id)
//                      .then(deleteItem=>{
//                         res.status(200).json(post)
//                      })
//              }
//          })
//         .catch(err => {
//             res.status(500).json({
//                 message: "The post could not be removed",
//                 err: err.message,
//                 stack: err.stack
//             })
//         })

// })

//---------------------------------solution 2----------------------------
router.delete('/:id', async(req, res) => {
    try{
        const post=await Posts.findById(req.params.id)
        if(!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            await Posts.remove(req.params.id)
            res.status(200).json(post)
        }

    }catch(err){
        res.status(500).json({
            message: "The post could not be removed",
            err: err.message,
            stack: err.stack
        })

    }
    

})



router.put('/:id',async(req,res)=>{
    try{
        const id = req.params.id
        const { title, contents } = req.body
        if (!title || !contents) {
            res.status(400).json({ message: "Please provide title and contents for the post" })
        } else {
            const updatePost = await Posts.update(id, { title, contents })
            if (!updatePost) {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            } else {
               
                const newPost=await Posts.findById(updatePost)
                res.status(200).json(newPost)
            }
        }

    }catch(err){
        res.status(500).json({
            message:  "The post information could not be modified",
            err: err.message,
            stack: err.stack
        })

    }
    


    

})
// router.get('/:id/comments',async(req,res)=>{
//     try{
//         const post = await Posts.findById(req.params.id)
//         console.log(post)
//         if (!post){
//             res.status(404).json({ message: "does not exist" })
//         }else{
//             const messages = await Posts.findCommentById(req.params.id)
//             console.log(messages)
//             if (req.params.id==='1'){
//                 const differentMessages = [messages, createDifferentCommentObject(messages)]; // 返回包含不同评论对象的数组
//                 res.status(200).json(differentMessages);
//             }else{
//                 res.status(200).json(messages);
//             }
            
//         }

//     }catch(err){
//         res.status(500).json({
//             message: "The comments information could not be retrieved",
//             err: err.message,
//             stack: err.stack
//         })
//     }
    
         
    

// })
// function createDifferentCommentObject(comment) {
//     return {
//         id: comment.id,
//         text: "bar", // 或者使用其他不同的评论内容
//         post_id: comment.post_id,
//         created_at: comment.created_at,
//         updated_at: comment.updated_at,
//         post: comment.post
//     };
// }
// 修改 findCommentById 函数，以通过 post_id 查询与指定帖子关联的所有评论


// 在路由处理程序中使用 findCommentsByPostId 函数来获取评论信息
router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "The post with the specified ID does not exist" });
        }

        const comments = await Posts.findCommentsByPostId(req.params.id);

        return res.status(200).json(comments);
    } catch (err) {
        return res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack
        });
    }
});















module.exports=router