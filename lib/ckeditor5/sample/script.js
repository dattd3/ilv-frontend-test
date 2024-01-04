const watchdog = new CKSource.EditorWatchdog();

window.watchdog = watchdog;

watchdog.setCreator((element, config) => {
  return CKSource.Editor.create(element, config).then((editor) => {
    return editor;
  });
});

watchdog.setDestructor((editor) => {
  return editor.destroy();
});

watchdog.on('error', handleSampleError);

watchdog
  .create(document.querySelector('.editor'), {
    // Editor configuration.
    removePlugins: [
      'ImageCaption',
      'Markdown',
      'Heading',
      'Title',
      'EditorWatchdog',
    ],
  })
  .catch(handleSampleError);

function handleSampleError(error) {
  const issueUrl = 'https://github.com/ckeditor/ckeditor5/issues';

  const message = [
    'Oops, something went wrong!',
    `Please, report the following error on ${issueUrl} with the build id "c72bt5x8edh1-tyl2vdzb49u7" and the error stack trace:`,
  ].join('\n');

  console.error(message);
  console.error(error);
}
