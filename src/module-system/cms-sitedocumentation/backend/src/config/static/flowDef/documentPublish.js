module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const content = {
    listener: null,
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Drafting',
          type: 'startEventAtom',
          options: {
            atom: {
              module: moduleInfo.relativeName,
              atomClassName: 'document',
            },
            atomStage: 0, // draft
            conditionExpression: null,
            task: {
              atomState: 0, // state: drafting
            },
          },
        },
        {
          id: 'activity_1',
          name: 'Review',
          type: 'activityUserTask',
          options: {
            assignees: {
              roles: 'superuser',
            },
            atomState: 1,
            confirmation: false,
            bidding: true,
            schema: {
              write: {
                module: 'a-cms',
                schema: 'article',
              },
            },
          },
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventAtom',
          options: {
            atomState: 2,
          },
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'endEvent_1',
        },
      ],
    },
  };
  const definition = {
    atomName: 'CMS Document Publish',
    atomStaticKey: 'flowDocumentPublish',
    atomRevision: 2,
    description: '',
    content: JSON.stringify(content),
  };
  return definition;
};
