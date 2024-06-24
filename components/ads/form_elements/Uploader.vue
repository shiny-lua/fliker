<template>
  <div class="image-uploader mt-4" :class="{ 'no-image': value.length === 0 }">
    <!-- <div v-for="(image, index) in value" :key="index" class="uploaded-image">
            <a href="javascript:;" class="btn-remove" @click.prevent="removeFile(image, index)">
                <fp-icon name="trash" class="fp-fs-20 text-white" />
            </a>
            <img :src="image.src_url" width="100%" height="100%" />
        </div> -->

    <div
      v-for="(file, index) in previewImages"
      :key="index"
      class="uploaded-image"
    >
      <a
        href="javascript:;"
        class="btn-remove"
        @click.prevent="removeFile(file, index)"
      >
        <fp-icon name="trash" class="fp-fs-20 text-white" />
      </a>
      <img :src="file.src_url" width="100%" height="100%" />
    </div>
    <file-upload
      v-if="value.length <= max_images"
      ref="uploader"
      v-model="files"
      name="image"
      accept="image/*"
      :post-action="null"
      :multiple="true"
      :maximum="max_images"
      @input-file="handleFileInput"
      :class="{
        'uploader-component': true,
        'no-image': value.length === 0,
      }"
    >
      <div class="file-selector">
        <div
          v-if="uploading"
          class="spinner-border fp-text-active mx-auto"
          style="border-width: 2px; width: 31px; height: 31px"
        ></div>
        <fp-icon
          v-else
          name="upload"
          class="fp-text-active"
          style="font-size: 38px"
        />
        <p>Click here to upload image</p>
        <p class="fp-text-color-main">
          <span
            v-if="previewImages.length > 0 && previewImages.length < max_images"
            >(You can now upload {{ max_images - previewImages.length }} more
            images)</span
          >
          <span
            v-else-if="previewImages.length === max_images"
            class="fp-text-active"
            >Reached maximum limit</span
          >
          <span
            v-else
            :class="'text-danger' && previewImages.length > max_images"
            >Max {{ max_images }} images Allowed</span
          >
        </p>
      </div>
    </file-upload>
  </div>
</template>
<script>
import Swal from "sweetalert2";
export default {
  name: "FpUploader",
  props: {
    url: { type: String, required: true },
    removeUrl: { type: String, required: true },
    value: { type: Array, required: true },
  },
  data() {
    return {
      max_images: 30,
      uploading: false,
      files: [],
      fileDuplicateError: "",
    };
  },

  methods: {
    handleFileInput(newFiles) {
      this.fileDuplicateError = "";
      const file = newFiles.file;
      const isDuplicate = this.checkForDuplicates(file);

      if (!isDuplicate) {
        let reader = new FileReader();
        reader.onload = (e) => {
          const fileData = {
            src_url: e.target.result,
            file: file,
          };
          this.$store.dispatch("ads/setPreviewImages", [
            ...this.$store.getters["ads/previewImages"],
            fileData,
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Some images are already uploaded!",
          reverseButtons: true,
          showCancelButton: true,
        });
      }
    },
    checkForDuplicates(newFile) {
      const existingFiles = this.$store.getters["ads/previewImages"];
      return existingFiles.some(
        (existingFile) =>
          existingFile.file.name === newFile.name &&
          existingFile.file.size === newFile.size
      );
    },

    // inputFile(newFile, oldFile) {
    //     if (this.value.length >= 30) {
    //         return false
    //     }
    //     this.$refs.uploader.active = true;
    //     if (newFile && oldFile) {
    //         if (newFile.active !== oldFile.active) {
    //             this.uploading = true
    //         }
    //         // Uploaded error
    //         if (newFile.error !== oldFile.error) {
    //             alert('Sorry, upload is failed. Please try again');
    //         }
    //         // Uploaded successfully
    //         if (newFile.success !== oldFile.success) {
    //             setTimeout(() => {
    //                 this.uploading = false;
    //                 this.$emit('input', [...this.value, newFile.response.data]);
    //             }, 500);
    //         }
    //     }
    // },
    removeFile(image, index) {
      const updatedImages = [...this.previewImages];
      updatedImages.splice(index, 1);
      this.$store.dispatch("ads/setPreviewImages", updatedImages);
      // this.$emit("removed", index);
    },

    // async removeFile(image, index) {
    //   const response = await this.axios.delete(`${this.removeUrl}${image.id}`);
    //   if (response.data.status === "Success") {
    //     this.files.splice(index, 1);
    //     this.$emit("removed", index);
    //   }
    // },
  },
  computed: {
    previewImages() {
      return this.$store.getters["ads/previewImages"];
    },
  },
};
</script>
<style lang="scss" scoped>
.uploader-component {
  @media (max-width: 600px) {
    margin-right: 16px;
    width: calc(100% - 16px);
  }
}
.image-uploader {
  display: flex;
  flex-wrap: wrap;
  border: dashed 1px #ff22a1;
  border-radius: 12px;
  min-height: 324px;
  background: rgba(255, 34, 161, 0.051);
  padding: 16px 0 0 16px;
  &.no-image {
    padding-right: 16px;
    align-items: center;
    justify-content: center;
  }
  .file-selector {
    padding: 24px;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
    p {
      margin-bottom: 0;
      &:nth-child(2) {
        font-size: 18px;
      }
      &:last-child {
        font-size: 14px;
      }
    }
  }
  .uploaded-image {
    position: relative;
    width: 160px;
    height: 160px;
    min-width: 160px;
    margin-right: 16px;
    margin-bottom: 16px;
    img {
      // border-radius: 6px;
      object-fit: cover;
    }
  }
  .btn-remove {
    position: absolute;
    top: 6px;
    right: 6px;
    padding: 1px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
  }
}
</style>
