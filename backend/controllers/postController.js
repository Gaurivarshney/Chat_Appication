import sharp from 'sharp';
import cloudinary from 'cloudinary';
import { Post } from '../models/postModel.js';
import { User } from '../models/userModel.js';
import {Comment} from '../models/commentModel.js';
import { getReceiverSocketId ,io} from '../socket/socket.js';

export const addNewPost = async(req,res)=>{
    try {
        const {caption}= req.body;
        const image = req.file;
        const authorId= req.id;

        if(!image) return res.status(400).json({message:"Image Required"});

        //image upload
        const optimizedImageBuffer = await sharp(image.buffer).resize({width:800, height:800}).toFormat('jpeg',{quality:80}).toBuffer();

        //buffer to data uri
        const fileUri= `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse= await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });

        const user = await User.findById(authorId);
        if(user){
            user.posts.push(post._id);
            await user.save()
        }
        await post.populate({path:'author',select:'-password'})

        return res.status(201).json({
            message:'New Post Added',
            post,
            success:true,
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const getAllPost = async(req,res)=>{
    try {
        const posts = await Post.find().sort({createdAt:-1})
        .populate({path:'author', select:'username profilePicture'})
        .populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        });
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}
export const getUserPost= async(req,res)=>{
    try {
        const authorId= req.id;
        const posts = await Post.find({author:authorId}).sort({createdAt:-1}).populate({
            path:'author',
            select:'username profilePicture'
        }).populate({
            path:'comments',
            sort:{createdAt:-1},
            populate:{
                path:'author',
                select:'username profilePicture'
            }
        })
        return res.status(200).json({
            posts,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const likePost = async(req,res)=>{
    try {
        const likeKrneWalaUserKiId= req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found", success:true});
        }

        //like krne ka logic
        await post.updateOne({$addToSet:{likes: likeKrneWalaUserKiId}});
        await post.save()
        //implement socket in for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString()
        if(postOwnerId!==likeKrneWalaUserKiId){
            //emit a notification event

            const notification ={
                type: 'like',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message:'Your post was liked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }


        return res.status(200).json({message: "Post Liked", success:true})
    } catch (error) {
        console.log(error);
        
    }
}
export const dislikePost = async(req,res)=>{
    try {
        const likeKrneWalaUserKiId= req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found", success:true});
        }

        //like krne ka logic
        await post.updateOne({$pull :{likes: likeKrneWalaUserKiId}});
        await post.save()
        //implement socket in for real time notification
        const user = await User.findById(likeKrneWalaUserKiId).select('username profilePicture');
        const postOwnerId = post.author.toString()
        if(postOwnerId!==likeKrneWalaUserKiId){
            //emit a notification event

            const notification ={
                type: 'dislike',
                userId: likeKrneWalaUserKiId,
                userDetails: user,
                postId,
                message:'Your post was disliked'
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification', notification);
        }


        return res.status(200).json({message: "Post disliked", success:true})
    } catch (error) {
        console.log(error);
        
    }
}

export const addComment = async(req,res)=>{
    try {
        const postId= req.params.id;
        const commentKrneWaleKiId= req.id;
        const {text}= req.body;
        const post = await Post.findById(postId)
        if(!text){
            return res.status(400).json({message:'text is required', success:false})
        }

        const comment = await Comment.create({
            text,
            author:commentKrneWaleKiId,
            post:postId
        })
        await comment.populate({
            path:'author',
            select:'username profilePicture'
        });
        post.comments.push(comment._id);
        await post.save()

        return res.status(201).json({
            message:'Comment Added',
            comment,
            success:true
        })

    } catch (error) {
        console.log(error);
        
    }
} 

export const getCommentsOfPost= async(req,res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId}).populate('author','username profilePicture');

        if(!comments){
            return res.status(404).json({message:"No comments found for this post", success:false})
        }
        return res.status(200).json({ success:true, comments})
    } catch (error) {
        console.log(error);
        
    }
}

export const deletePost = async(req,res)=>{
    try {
        const postId= req.params.id;
        const authorId= req.id;
        const post= await Post.findById(postId)
        if(!post){
            return res.status(404).json({message:'Post not found', success:true})

        }
        if(post.author.toString()!==authorId){
            return res.status(403).json({message:'Unauthorized Access', success:false})
        }

        await Post.findByIdAndDelete(postId);

        //remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts= user.posts.filter(id=>id.toString()!==postId);
        await user.save();

        //delete associated comments
        await Comment.deleteMany({post:postId})

        return res.status(200).json({
            success:true,
            message:'Post Deleted!'
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const bookmarkPost = async(req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'post not found', success: false });

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'unsaved', message: 'post removed from bookmark', success: true });
        } else {
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();
            return res.status(200).json({ type: 'saved', message: 'post bookmarked', success: true });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};
