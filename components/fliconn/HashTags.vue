<template>
    <div class="fliconn-hash-tags fp-card">
        <div class="fp-card-header">
            <p class="fp-card-title">Hashtags</p>
        </div>
        <div class="fp-card-body">
            <div class="hash-tag-wrapper">
                <span class="hash-tag-item">#health (1.2K)</span>
                <span class="hash-tag-item">#travel (12)</span>
                <span class="hash-tag-item">#movies (5.6K)</span>
                <span class="hash-tag-item">#health (1.2K)</span>
                <span class="hash-tag-item">#health (1.2K)</span>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .fliconn-hash-tags {
        padding: 16px;
        .btn-create {
            color: #FFF;
            border: none;
            background: linear-gradient(100.05deg, #FF22A1 2.3%, #FFA3D8 100%);
            padding: 7px 15px;
            font-size: 13px;
        }
        .hash-tag-wrapper {
            margin-right: -12px;
            .hash-tag-item {
                cursor: pointer;
                display: inline-block;
                font-size: 13px;
                font-weight: 400;
                margin-top: 16px;
                padding: 4px 10px;
                border-radius: 5px;
                margin-right: 12px;
                border: solid 1px #FF22A1;
            }
        }
    }
</style>