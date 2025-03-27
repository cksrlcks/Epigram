import { useTodayEpigram } from '@/apis/epigram/epigram.queries';
import { Section } from '@/components/Section';
import Card from '@/components/Card';

export default function TodayEpigram() {
  const { data, isError } = useTodayEpigram();

  if (isError || !data) {
    return (
      <>
        <Section>오늘의 에피그램</Section>
        <div className='flex items-center justify-center p-10 text-blue-400'>
          오늘의 에피그램이 없습니다.
        </div>
      </>
    );
  }

  return (
    <>
      <Section>오늘의 에피그램</Section>
      <Card
        id={data.id}
        content={data.content}
        author={data.author}
        likeCount={data.likeCount}
        writerId={data.writerId}
        referenceUrl={data.referenceUrl ?? ''}
        referenceTitle={data.referenceTitle}
        tags={data.tags}
      />
    </>
  );
}
