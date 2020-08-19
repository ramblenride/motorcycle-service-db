// MIT License
// 
// Copyright (c) 2020 Sébastien Côté
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

module.exports = function (grunt) {
  const JSON_SCHEMA = 'src/moto-service.schema.json';
  const JSON_SCHEMA_VERSION = 'json-schema-draft-07';
  const JSON_SOURCE = ['src/**/*.json', '!src/**/*.schema.json'];
  const JSON_OUTPUT_DIR = 'output';
  const JSON_OUTPUT = `${JSON_OUTPUT_DIR}/motorcycle-service-intervals.json`;

  grunt.initConfig({
    clean: [`${JSON_OUTPUT_DIR}/*`],
    jsonlint: {
      options: {
        format: true,
        prettyPrint: true,
        sortKeys: true,
        indent: 3,
        schema: {
          src: JSON_SCHEMA,
          environment: JSON_SCHEMA_VERSION
        }
      },

      // Validate and format the input files. Errors are easier to find/correct here.
      pre: {
        src: JSON_SOURCE,
      },

      // Validate and format the output file after the merge.
      post: {
        src: JSON_OUTPUT,
      }
    },

    'merge-moto-json': {
      all: {
        src: JSON_SOURCE,
        dest: JSON_OUTPUT
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.registerMultiTask('merge-moto-json', 'Merge mototorcycle service JSON files', function () {
    var options = this.options();
    grunt.verbose.writeflags(options, "Options");

    /*  iterate over all src-dest file pairs  */
    this.files.forEach(function (f) {
      try {
        /*  start with an empty object  */
        var json = {
          motorcycles: []
        };
        f.src.forEach(function (src) {
          /*  merge JSON file into object  */
          if (!grunt.file.exists(src))
            throw "JSON source file \"" + src + "\" not found.";
          else {
            var fragment;
            grunt.log.debug("reading JSON source file \"" + src + "\"");
            try { fragment = grunt.file.readJSON(src); }
            catch (e) { grunt.fail.warn(e); }
            json.motorcycles.push(...fragment.motorcycles);
          }
        });

        /*  write object as new JSON  */
        grunt.log.debug("writing JSON destination file \"" + f.dest + "\"");
        grunt.file.write(f.dest, JSON.stringify(json, options.replacer, options.space));
        grunt.log.writeln("File \"" + f.dest + "\" created.");
      }
      catch (e) {
        grunt.fail.warn(e);
      }
    });
  });

  grunt.registerTask('default', ['clean', 'jsonlint:pre', 'merge-moto-json', 'jsonlint:post']);
};
