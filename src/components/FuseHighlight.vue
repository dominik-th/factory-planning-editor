<template>
  <span class="fuse-highlight" :inner-html.prop="result | hightlight(indices)"></span>
</template>

<script>
export default {
  name: 'FuseHighlight',
  filters: {
    hightlight(text, indices) {
      let highlighted = '';
      // flatten the indices from [[0,1], [2,3]] to [0,1,2,3]
      let reducer = (acc, val) => acc.concat(val);
      let flatIndices = indices
        .reduce(reducer, [])
        .map((y, i) => (i % 2 === 0 ? y : y + 1));
      let flatIndicesIndex = 0;

      [...text].forEach((char, index) => {
        if (index === flatIndices[flatIndicesIndex]) {
          // highlight using the <b> bold tag
          // every even index in flatIndices starts the highlighting of a sequence
          highlighted += flatIndicesIndex % 2 === 0 ? '<b>' : '</b>';
          flatIndicesIndex++;
        }
        // escape potentially dangerous characters
        highlighted += char
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
      });

      return highlighted;
    }
  },
  props: {
    result: {
      type: String,
      default: ''
    },
    indices: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style scoped>
.fuse-highlight {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style>
