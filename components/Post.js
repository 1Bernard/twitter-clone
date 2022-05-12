import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
  } from "@firebase/firestore";
import {
    ChartBarIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    SwitchHorizontalIcon,
    TrashIcon,
  } from "@heroicons/react/outline";
  import { 
    HeartIcon as HeartIconFilled,
  } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { firestore } from '../firebase';


/* eslint-disable @next/next/no-img-element */
function Post({id, post, postPage}) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    const router = useRouter();

    useEffect(
        () =>
          onSnapshot(
            query(
              collection(firestore, "posts", id, "comments"),
              orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
          ),
        [firestore, id]
      );
    
      useEffect(
        () =>
          onSnapshot(collection(firestore, "posts", id, "likes"), (snapshot) =>
            setLikes(snapshot.docs)
          ),
        [firestore, id]
      );
    
      useEffect(
        () =>
          setLiked(
            likes.findIndex((like) => like.id === session?.user?.uid) !== -1
          ),
        [likes]
      );
    
      const likePost = async () => {
        if (liked) {
          await deleteDoc(doc(firestore, "posts", id, "likes", session.user.uid));
        } else {
          await setDoc(doc(firestore, "posts", id, "likes", session.user.uid), {
            username: session.user.name,
          });
        }
      };

  return (
    <div className='p-3 flex cursor-pointer border-b border-gray-200' onClick={() => router.push(`/${id}`)}>
        {!postPage && (
            <img src={post?.userImg} alt='' className='h-11 w-11 rounded-full mr-4'/>
        )}

        <div className='flex flex-col space-y-2 w-full'>
            <div className={`flex ${!postPage && 'justify-between '}`}>
                {postPage && (
                    <img src={post?.userImg} alt='Profile Pic' className='h-11 w-11 rounded-full mr-4'/>
                )}
                <div className='text-[#050505]' >
                    <div className='inline-block group'>
                        <h4 className= {`font-bold text-[15px] sm:text-base group-hover:underline decoration-gray-400 ${!postPage && 'inline-block'}`}>{post?.username}</h4>
                        <span className= {`text-sm text-gray-600 sm:text-[15px] ${!postPage && 'ml-1.5'}`}>@{post?.tag}</span>
                        
                    </div> {''}
                    ·{" "}
                    <span className='hover:underline decoration-gray-400 text-sm text-gray-600  sm:text-[15px]'>
                    {''} <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                    </span>
                    {!postPage && (
                        <p className='text-[050505] text-[15px] sm:text-base mt-0.5'>{post?.text}</p>
                    )}
                </div>
                <div className='icon group flex-shrink-0 ml-auto'>
                <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                </div>
            </div>
            {postPage && (
                        <p className='text-[050505] text-[15px] sm:text-base mt-0.5'>{post?.text}</p>
                    )}
            <img src={post?.image} alt='' className='rounded-2xl max-h-[700px] object-cover mr-2'/>
            <div className={`text-[#6e767d] flex justify-between w-10/12 ${postPage && 'mx-auto'}`}>
            <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setPostId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>

          {session.user.uid === post?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(firestore, "posts", id));
                router.push("/");
              }}
            >
              <div className="icon group-hover:bg-red-600/10">
                <TrashIcon className="h-5 group-hover:text-red-600" />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-green-500/10">
                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
              </div>
            </div>
          )}

          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likePost();
            }}
          >
            <div className="icon group-hover:bg-pink-600/10">
              {liked ? (
                <HeartIconFilled className="h-5 text-pink-600" />
              ) : (
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              )}
            </div>
            {likes.length > 0 && (
              <span
                className={`group-hover:text-pink-600 text-sm ${
                  liked && "text-pink-600"
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>

          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
            </div>      

        </div>

    </div>
  )
}
export default Post