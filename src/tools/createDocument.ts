import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { outlineClient } from '../client.js';
import { CreateDocumentArgs } from '../types.js';
import { registerTool } from '../utils/listTools.js';
import { logger } from '../utils/logger.js';

// Register this tool
registerTool<CreateDocumentArgs>({
  name: 'create_document',
  description: 'Create a new document',
  inputSchema: {
    properties: {
      title: {
        type: 'string',
        description: 'Title of the document',
      },
      text: {
        type: 'string',
        description: 'Content of the document in markdown format',
      },
      collectionId: {
        type: 'string',
        description: 'ID of the collection to add the document to',
      },
      parentDocumentId: {
        type: 'string',
        description: 'ID of the parent document (if creating a nested document)',
      },
      publish: {
        type: 'boolean',
        default: true,
        description: 'Whether to publish the document immediately',
      },
      template: {
        type: 'boolean',
        description: 'Whether this document is a template',
      },
    },
    required: ['title', 'text', 'collectionId'],
    type: 'object',
  },
  handler: async function handleCreateDocument(args: CreateDocumentArgs) {
    try {
      const payload: Record<string, any> = {
        title: args.title.trim(),
        collectionId: args.collectionId.trim(),
      };

      if (args.text && args.text.trim()) {
        payload.text = args.text.trim();
      }
      if (args.parentDocumentId && args.parentDocumentId.trim()) {
        payload.parentDocumentId = args.parentDocumentId.trim();
      }
      if (args.template !== undefined) {
        payload.template = args.template;
      }
      if (args.publish !== undefined) {
        payload.publish = args.publish;
      }

      const response = await outlineClient.post('/documents.create', payload);
      return response.data.data;
    } catch (error: any) {
      logger.error(`Error creating document: ${error.message}`);
      throw new McpError(ErrorCode.InvalidRequest, error.message);
    }
  },
});
