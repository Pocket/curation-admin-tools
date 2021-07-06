import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileUploadInfo } from './FileUploadInfo';
import { FileWithPath } from 'react-dropzone';
import { formatFileSize } from '../../utils/formatFileSize';

describe('The FileUploadInfo component', () => {
  it('shows information for the supplied file', () => {
    const mockFile: FileWithPath = {
      name: 'chucknorris.png',
      type: 'image/png',
      path: '/home/cnorris/photos/1999/chucknorris.png',
      lastModified: 111222333,
      size: 333444,
      arrayBuffer: jest.fn(),
      slice: jest.fn(),
      stream: jest.fn(),
      text: jest.fn(),
    };

    render(<FileUploadInfo file={mockFile} />);

    const name = screen.getByText(`Name: ${mockFile.name}`);
    expect(name).toBeInTheDocument();

    const size = screen.getByText(`Size: ${formatFileSize(mockFile.size)}`);
    expect(size).toBeInTheDocument();

    const type = screen.getByText(`Type: ${mockFile.type}`);
    expect(type).toBeInTheDocument();
  });
});
