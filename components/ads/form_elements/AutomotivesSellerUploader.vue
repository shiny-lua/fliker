<template>
  <div class="image-uploader mt-4" :class="{ 'no-image': value.length === 0 }">
    <div v-for="(file, index) in automotiveSellerImages" :key="index" class="uploaded-image">
      <a href="javascript:;" class="btn-remove" @click.prevent="removeFile(file, index)">
        <fp-icon name="trash" class="fp-fs-20 text-white" />
      </a>
      <img :src="file.src_url" width="100%" height="100%" />
    </div>
    <file-upload v-if="value.length <= max_images" ref="uploader" v-model="files" name="image" accept="image/*"
                 :post-action="null" :multiple="true" :maximum="max_images" @input-file="handleFileInput" :class="{
                   'uploader-component': true,
                   'no-image': value.length === 0,
                 }">
      <div class="file-selector">
        <div v-if="uploading" class="spinner-border fp-text-active mx-auto"
             style="border-width: 2px; width: 31px; height: 31px"></div>
        <fp-icon v-else name="upload" class="fp-text-active" style="font-size: 38px" />
        <p>Click here to upload image</p>
        <p class="fp-text-color-main">
          <span v-if="automotiveSellerImages.length > 0 &&
            automotiveSellerImages.length < max_images
            ">(You can now upload
            {{ max_images - automotiveSellerImages.length }} more images)</span>
          <span v-else-if="automotiveSellerImages.length === max_images" class="fp-text-active">Reached maximum
            limit</span>
          <span v-else :class="'text-danger' && automotiveSellerImages.length > max_images">Max {{ max_images }} images
            Allowed</span>
        </p>
      </div>
    </file-upload>
  </div>
</template>
<script>
import Swal from "sweetalert2";
export default {
  name: "AutomotivesUploader",
  props: {
    value: {
      type: Array,
      required: true,
      // default: () => [],
    },
    max_images: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      files: [],
      uploading: false,
      fileDuplicateError: "",
    };
  },
  computed: {
    automotiveSellerImages() {
      return this.$store.getters["ads/automotiveSellerImages"];
    },
  },
  methods: {
    handleFileInput(newFiles) {
      // this.$store.dispatch("ads/setAutomotiveSellerImages", []);
      console.log("newFiles", newFiles)
      this.fileDuplicateError = "";
      const file = newFiles.file;
      // const isDuplicate = this.checkForDuplicates(file);
      let reader = new FileReader();
        reader.onload = (e) => {
          const fileData = {
            src_url: e.target.result,
            file: file,
          };
          console.log("fileData", fileData)
          this.$store.dispatch("ads/setAutomotiveSellerImages", [
            ...this.$store.getters["ads/automotiveSellerImages"],
            fileData,
          ]);
        };
        console.log("fileData", )
        reader.readAsDataURL(file);
      // if (!isDuplicate) {
        
      // } else {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Oops...",
      //     text: "Some images are already uploaded!",
      //     reverseButtons: true,
      //     showCancelButton: true,
      //   });
      // }
    },
    checkForDuplicates(newFile) {
      const existingFiles = this.$store.getters["ads/automotiveSellerImages"];
      return existingFiles.some(
        (existingFile) => {
          console.log("existingFile", existingFile)    
          existingFile.file.name === newFile.name &&
          existingFile.file.size === newFile.size
      
        });
    },
    removeFile(image, index) {
      const updatedImages = [...this.automotiveSellerImages];
      updatedImages.splice(index, 1);
      this.$store.dispatch("ads/setAutomotiveSellerImages", updatedImages);
      // this.$emit("removed", index);
    },
  },
  mounted() {
    console.log("image", this.images)
    console.log(
      "Component loaded. Initial automotiveSellerImages:",
      this.automotiveSellerImages
    );
  },
};
</script>
<style scoped>
.uploader-component {
  @media (max-width: 600px) {
    margin-right: 16px;
    width: calc(100% - 16px);
  }
}

.image-uploader {
  display: flex;
  justify-content: center;
  align-items: center;
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
      /* // border-radius: 6px; */
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
