import { render, screen, fireEvent } from '@testing-library/react';
import Chip from './Chip';

const TEST_LABEL = '테스트 칩';

describe('Chip 컴포넌트', () => {
  it('라벨이 정상적으로 렌더링된다', () => {
    render(<Chip label={TEST_LABEL} />);
    const labelElement = screen.getByText(TEST_LABEL);
    expect(labelElement).toBeInTheDocument();
  });

  it('onRemove prop이 없으면 삭제 아이콘이 렌더링되지 않는다', () => {
    render(<Chip label={TEST_LABEL} />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeNull();
  });

  it('onRemove prop이 있으면 삭제 아이콘이 렌더링된다', () => {
    const onRemoveMock = jest.fn();
    render(<Chip label={TEST_LABEL} onRemove={onRemoveMock} />);
    const svgElement = document.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
  });

  it('삭제 아이콘 클릭 시 onRemove가 호출된다', () => {
    const onRemoveMock = jest.fn();
    const { container } = render(<Chip label={TEST_LABEL} onRemove={onRemoveMock} />);
    const svgElement = container.querySelector('svg');
    expect(svgElement).toBeInTheDocument();
    if (svgElement) {
      fireEvent.click(svgElement);
    }
    expect(onRemoveMock).toHaveBeenCalledTimes(1);
  });
});
