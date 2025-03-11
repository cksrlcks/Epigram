import { render, screen, fireEvent } from '@testing-library/react';
import Toggle from './Toggle';

describe('Toggle 컴포넌트', () => {
  it('체크되지 않은 상태로 렌더링된다', () => {
    render(<Toggle isChecked={false} onChange={jest.fn()} id='test-toggle' />);

    const toggleInput = screen.getByRole('checkbox', { name: /test-toggle/i });

    expect(toggleInput).not.toBeChecked();
  });

  it('체크된 상태로 렌더링된다', () => {
    render(<Toggle isChecked={true} onChange={jest.fn()} id='test-toggle' />);

    const toggleInput = screen.getByRole('checkbox', { name: /test-toggle/i });

    expect(toggleInput).toBeChecked();
  });

  it('클릭 시 onChange가 호출된다', () => {
    const onChangeMock = jest.fn();
    render(<Toggle isChecked={false} onChange={onChangeMock} id='test-toggle' />);

    const toggleInput = screen.getByRole('checkbox', { name: /test-toggle/i });
    fireEvent.click(toggleInput);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it('text가 전달되면 표시된다', () => {
    render(<Toggle isChecked={false} onChange={jest.fn()} text='공개' id='test-toggle' />);

    const textElement = screen.getByText('공개');

    expect(textElement).toBeInTheDocument();
  });

  it('text가 전달되지 않으면 표시되지 않는다', () => {
    render(<Toggle isChecked={false} onChange={jest.fn()} id='test-toggle' />);

    const textElement = screen.queryByText('공개');

    expect(textElement).not.toBeInTheDocument();
  });

  it('color prop이 적용된다', () => {
    render(
      <Toggle
        isChecked={false}
        onChange={jest.fn()}
        color='text-red-500'
        text='테스트'
        id='test-toggle'
      />,
    );

    const textElement = screen.getByText('테스트');

    expect(textElement).toHaveClass('text-red-500');
  });

  it('name prop이 적용된다', () => {
    render(<Toggle isChecked={false} onChange={jest.fn()} name='toggle-name' id='test-toggle' />);

    const toggleInput = screen.getByRole('checkbox', { name: /test-toggle/i });

    expect(toggleInput).toHaveAttribute('name', 'toggle-name');
  });

  it('id prop이 적용된다', () => {
    render(<Toggle isChecked={false} onChange={jest.fn()} id='custom-toggle-id' />);

    const toggleInput = screen.getByRole('checkbox', { name: /custom-toggle-id/i });

    expect(toggleInput).toHaveAttribute('id', 'custom-toggle-id');
  });
});
