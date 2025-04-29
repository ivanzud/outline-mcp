import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { outlineClient } from '../client.js';
import { CreateCommentArgs } from '../types.js';
import { registerTool } from '../utils/listTools.js';

// Register this tool
registerTool<CreateCommentArgs>({
  name: 'create_comment',
  description: 'Create a new comment on a document',
  inputSchema: {
    properties: {
      documentId: {
        type: 'string',
        description: 'ID of the document to comment on',
      },
      text: {
        type: 'string',
        description: 'The body of the comment in markdown',
      },
      parentCommentId: {
        type: 'string',
        description: 'ID of the parent comment (if replying to a comment)',
      },
      data: {
        type: 'object',
        description: 'Additional data for the comment',
      },
    },
    required: ['documentId'],
    type: 'object',
  },
  handler: async function handleCreateComment(args: CreateCommentArgs) {
    try {
      // Start with the minimum required field
      const payload: Record<string, any> = {
        documentId: args.documentId.trim(),
      };

      // Add optional fields only if they have content
      if (args.text?.trim()) {
        payload.text = args.text.trim();
      }
      if (args.parentCommentId?.trim()) {
        payload.parentCommentId = args.parentCommentId.trim();
      }
      if (args.data && Object.keys(args.data).length > 0) {
        payload.data = args.data;
      }

      // Make the request
      const response = await outlineClient.post('/comments.create', payload);
      return response.data.data;
    } catch (error: any) {
      console.error('Error creating comment:', error.message);
      throw new McpError(ErrorCode.InvalidRequest, error.message);
    }
  },
});
