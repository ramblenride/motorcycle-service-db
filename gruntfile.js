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
  const JSON_OUTPUT_DIR = 'dist';
  const JSON_DB_OUTPUT = `${JSON_OUTPUT_DIR}/motorcycle-service-intervals.json`;
  const JSON_INDEX_OUTPUT = `${JSON_OUTPUT_DIR}/motorcycle-service-index.json`;

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
        src: JSON_DB_OUTPUT
      }
    },

    'merge-moto-json': {
      all: {
        src: JSON_SOURCE,
        dest: JSON_DB_OUTPUT,
        index: JSON_INDEX_OUTPUT,
        templates: JSON_OUTPUT_DIR,
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jsonlint');

  grunt.registerMultiTask('merge-moto-json', 'Merge mototorcycle service JSON files', function () {
    let options = this.options();
    let names = new Set();
    let index = {};
    grunt.verbose.writeflags(options, "Options");

    /* iterate over all src-dest file pairs  */
    this.files.forEach(function (f) {
      try {
        let jsonDb = {
          motorcycles: []
        };
        f.src.forEach(function (src) {
          if (!grunt.file.exists(src))
            throw "JSON source file \"" + src + "\" not found.";
          else {
            let fragment;
            grunt.log.debug("reading JSON source file \"" + src + "\"");
            try { 
              fragment = grunt.file.readJSON(src); 
              const name = fragment.motorcycles[0].name;
              if (names.has(name)) {
                grunt.fail.warn(`Template name already used: ${name}`);
              }
              names.add(name);
              jsonDb.motorcycles.push(...fragment.motorcycles);

              const location = src.substr(4);
              index[name] = {
                name: name,
                description: fragment.motorcycles[0].description,
                location: location,
              };

              grunt.file.copy(src, `${f.templates}/${location}`);
              
            }
            catch (e) { grunt.fail.warn(e); }
          }
        });

        /* write DB as new JSON */
        grunt.log.debug("writing JSON DB file \"" + f.dest + "\"");
        grunt.file.write(f.dest, JSON.stringify(jsonDb, options.replacer, options.space));
        grunt.log.writeln("File \"" + f.dest + "\" created.");

        /* write index as new JSON */
        grunt.log.debug("writing JSON index file \"" + f.index + "\"");
        grunt.file.write(f.index, JSON.stringify(index, options.replacer, options.space));
        grunt.log.writeln("File \"" + f.index + "\" created.");
      }
      catch (e) {
        grunt.fail.warn(e);
      }
    });
  });

  grunt.registerTask('default', ['clean', 'jsonlint:pre', 'merge-moto-json', 'jsonlint:post']);
};
