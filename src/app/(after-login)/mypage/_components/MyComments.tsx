'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDeleteComment } from '@/apis/comment/comment.queries';
import type { Comment as CommentType } from '@/apis/comment/comment.type';
import Comment from '@/components/Comment';
import Spinner from '@/components/Spinner';
import EtcButton from '@/components/EtcButton';
import Icon from '@/components/Icon';
import DeleteModal from '@/components/DeleteModal';
import Image from 'next/image';
import emptyImg from '@/assets/img/empty.png';

interface MyCommentsProps {
  comments: CommentType[];
  isFetching: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

export default function MyComments({
  comments,
  isFetching,
  hasNextPage,
  fetchNextPage,
}: MyCommentsProps) {
  const router = useRouter();
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const { mutate: deleteComment, isPending: isDeletePending } = useDeleteComment();

  const handleDeleteConfirm = (commentId: number) => {
    setSelectedCommentId(commentId);
  };

  const handleDelete = () => {
    if (!selectedCommentId) return;

    deleteComment(selectedCommentId, {
      onSuccess: () => {
        toast.success('댓글이 삭제되었습니다.');
        setSelectedCommentId(null);
      },
      onError: () => {
        toast.error('댓글 삭제에 실패했습니다.');
      },
    });
  };

  const isShowLoader = isFetching;
  const isShowMoreTrigger = !isFetching && hasNextPage;
  const isShowEmpty = !comments.length && !isFetching;
  const isShowEnd = !isFetching && !hasNextPage && !isShowEmpty;

  return (
    <>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <Comment {...comment} handleDelete={() => handleDeleteConfirm(comment.id)} />
          </li>
        ))}
      </ul>

      {isShowEmpty && (
        <div className='flex flex-col items-center justify-center'>
          <Image
            src={emptyImg}
            alt='아직 작성한 댓글이 없음을 나타내는 이미지'
            width={200}
            height={200}
            className='mt-[38px] h-24 w-24 lg:mt-[76px] lg:h-36 lg:w-36'
          />
          <span className='text-black-600 text-md mt-2 mb-8 text-center md:mt-4 md:mb-10 lg:mt-6 lg:mb-12 lg:text-xl'>
            아직 작성한 댓글이 없어요!
            <br />
            댓글을 달고 다른 사람들과 교류해 보세요.
          </span>
          <EtcButton
            variant='outlined'
            onClick={() => router.push('/feeds')}
            size='lg'
            className='text-black-400 border-gray-100 font-medium md:text-[14px] lg:text-[20px]'
          >
            에피그램 둘러보기
          </EtcButton>
        </div>
      )}

      {isShowLoader && (
        <div className='flex flex-col items-center justify-center gap-4 p-4 text-center text-blue-400'>
          <Spinner className='fill-black text-gray-100' />
          댓글을 불러오는 중입니다.
        </div>
      )}

      {isShowEnd && (
        <div className='flex items-center justify-center p-10 text-gray-500'>
          모든 댓글을 불러왔습니다.
        </div>
      )}

      {isShowMoreTrigger && (
        <div className='flex items-center justify-center p-4'>
          <EtcButton variant='outlined' onClick={fetchNextPage} size='lg'>
            <Icon name='plus' /> 내 댓글 더보기
          </EtcButton>
        </div>
      )}

      <DeleteModal
        isOpen={selectedCommentId !== null}
        type='comment'
        onClose={() => setSelectedCommentId(null)}
        onDelete={handleDelete}
        isSubmitting={isDeletePending}
      />
    </>
  );
}
