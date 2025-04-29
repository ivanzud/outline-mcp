import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { outlineClient } from '../client.js';
import { ListDocumentsArgs } from '../types.js';
import { registerTool } from '../utils/listTools.js';

// Register this tool
registerTool<ListDocumentsArgs>({
  name: 'list_documents',
  description: 'List documents in the Outline workspace with optional filters',
  inputSchema: {
    properties: {
      collectionId: {
        type: 'string',
        description: 'Filter by collection ID (optional)',
      },
      query: {
        type: 'string',
        description: 'Search query to filter documents (optional)',
      },
      limit: {
        type: 'number',
        description: 'Maximum number of documents to return (optional)',
      },
      offset: {
        type: 'number',
        description: 'Pagination offset (optional)',
      },
      sort: {
        type: 'string',
        description: 'Field to sort by (e.g. "updatedAt") (optional)',
      },
      direction: {
        type: 'string',
        description: 'Sort direction, either "ASC" or "DESC" (optional)',
        enum: ['ASC', 'DESC'],
      },
      template: {
        type: 'boolean',
        description: 'Optionally filter to only templates (optional)',
      },
      userId: {
        type: 'string',
        description: 'Optionally filter by user ID (optional)',
      },
      parentDocumentId: {
        type: 'string',
        description: 'Optionally filter by parent document ID (optional)',
      },
      backlinkDocumentId: {
        type: 'string',
        description: 'Optionally filter by backlink document ID (optional)',
      },
    },
    type: 'object',
  },
  handler: async function handleListDocuments(args: ListDocumentsArgs) {
    try {
      // Create the payload object with only non-null values
      const payload: Record<string, any> = {};

      if (args.offset !== null && args.offset !== undefined) {
        payload.offset = args.offset;
      }
      if (args.limit !== null && args.limit !== undefined) {
        payload.limit = args.limit;
      }
      if (args.sort !== null && args.sort) {
        payload.sort = args.sort;
      }
      if (args.direction !== null && args.direction) {
        payload.direction = args.direction;
      }
      if (args.collectionId !== null && args.collectionId) {
        payload.collectionId = args.collectionId;
      }
      if (args.userId !== null && args.userId) {
        payload.userId = args.userId;
      }
      if (args.backlinkDocumentId !== null && args.backlinkDocumentId) {
        payload.backlinkDocumentId = args.backlinkDocumentId;
      }
      if (args.parentDocumentId !== null && args.parentDocumentId) {
        payload.parentDocumentId = args.parentDocumentId;
      }
      if (args.template !== null && args.template !== undefined) {
        payload.template = args.template;
      }
      if (args.query !== null && args.query) {
        payload.query = args.query;
      }

      // Make the POST request to the documents.list endpoint
      const response = await outlineClient.post('/documents.list', payload);

      // Transform the response to a more usable format
      const documents = response.data.data;

      // Return the documents with additional metadata
      return {
        documents,
        pagination: {
          offset: response.data.pagination.offset,
          limit: response.data.pagination.limit,
          nextPath: response.data.pagination.nextPath,
          totalCount: response.data.pagination.totalCount,
        },
      };
    } catch (error: any) {
      console.error('Error listing documents:', error.message);
      throw new McpError(ErrorCode.InvalidRequest, error.message);
    }
  },
});
