import messageModel from "../../../database/models/messageModel.js";
import { catchAsyncError } from "../../utils/catchAsyncError.js";
import { AppError } from '../../utils/AppError.js';

export const sendMessage = catchAsyncError(async(req,res,next)=>{
    const {id,message} = req.body
    const userMessage = await messageModel.insertMany({sentToUserId:id,message:message, ip:  req.ip, userAgent: req.get('User-Agent')})
    userMessage ? res.status(200).json({status:200,message:"success"}) : next(new AppError("Failed to send message",400))
})


export const getUserMessages = catchAsyncError(async(req,res,next)=>{
    const id = req.userId
    const messages = await messageModel.find({sentToUserId:id}).sort({createdAt: -1});
    res.status(200).json({status:200,message:"success",messages})
})

export const updateVisibility = catchAsyncError(async (req, res, next)=>{
    const id = req.userId
    const {_id} = req.params
    const message = await messageModel.findOneAndUpdate(
        {_id:_id, sentToUserId: id}, 
        [ { "$set": { "isShown": { "$eq": [false, "$isShown"] } } } ])
    console.log(message);
    message ? res.status(200).json({status:200,message:"success"}) :
    next(new AppError("Failed to update message",400))
    
}

)

export const getUserMessagesById = catchAsyncError (async (req, res, next)=>{
    const {_id} = req.params
    const messages = await messageModel.find({sentToUserId:_id}).sort({createdAt: -1});
    res.status(200).json({status:200,message:"success",messages})

})  
export const deleteUserMessage = catchAsyncError(async(req,res,next)=>{
    const id = req.userId
    const {_id} = req.params
    const message = await messageModel.findOneAndDelete({sentToUserId:id,_id});
    message ? res.status(200).json({status:200,message:"success"}) : next(new AppError("Failed to delete message",400))
})