import { useState } from "react"
import _ from "lodash"
import { CKEditor } from "@ckeditor/ckeditor5-react"
import { Editor as ClassicEditor } from "ckeditor5-custom-build"
import { UploadAdapterPlugin } from "commons/UploadAdapter"
// import emailTemplateAjax from "../../ajax/emailTemplate"

function Editor({ onChange, data, name = "", config = {}, ...props }) {
    const [prevUrlImages, setPrevUrlImages] = useState([]);

    const handleChange = (e, editor) => {
        const urlImages = Array.from(
            new DOMParser()
            .parseFromString(editor.getData(), "text/html")
            .querySelectorAll("img")
        ).map((img) => img.getAttribute("src")),
        imageDeleted = _.without(
            _.difference(prevUrlImages, urlImages),
            null,
            ""
        );

        // if (imageDeleted?.length > 0) {
        //   emailTemplateAjax.deleteNotificationImages({
        //     images: imageDeleted,
        //   });
        // }

        setPrevUrlImages(urlImages);
        onChange(e, editor);
    };

//   if (!CKEditor) return <div>Editor content is loading</div>;

    return (
        <CKEditor
            name={name}
            editor={ClassicEditor}
            data={data}
            onChange={handleChange}
            config={{
                toolbar: {
                items: [
                    "findAndReplace",
                    "selectAll",
                    "|",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "code",
                    "removeFormat",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "todoList",
                    "|",
                    "outdent",
                    "indent",
                    "|",
                    "undo",
                    "redo",
                    "-",
                    "fontSize",
                    "fontFamily",
                    "fontColor",
                    "fontBackgroundColor",
                    "highlight",
                    "|",
                    "alignment",
                    "|",
                    "link",
                    "insertImage",
                    "blockQuote",
                    "insertTable",
                    "codeBlock",
                    "htmlEmbed",
                    "|",
                    "horizontalLine",
                    "pageBreak",
                    "|",
                    "sourceEditing",
                ],
                shouldNotGroupWhenFull: true,
                },
                removePlugins: [
                "ImageCaption",
                "Markdown",
                "Heading",
                "Title",
                "EditorWatchdog",
                "MediaEmbedToolbar",
                ],
                language: "vi",
                extraPlugins: [UploadAdapterPlugin],
                htmlSupport: {
                allow: [
                    {
                    name: "iframe",
                    attributes: true,
                    classes: true,
                    styles: true,
                    },
                ],
                },
                allowedContent: true,
                ...config,
            }}
            {...props}
        />
    )
}

export default Editor
