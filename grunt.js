// This is the main application configuration file.  It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
//
module.exports = function(grunt) {

  // Needed vars to start
  var phonegapLib = '/Development/phonegap_2.2.0/lib'
    , reverseDomain = 'com.example'
    , projectName = 'boilerplate';

  // import tasks
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-contrib-jade'); /* as long default jade won't allow wildcard for target files */
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadTasks("tasks");

  grunt.initConfig({

    meta: {
      location: __dirname,
      reverseDomain: reverseDomain,
      projectName: projectName
    },

    shell: {
      /* create phonegap projects */
      createIOS: {
        command: './ios/bin/create <%= meta.location %>/ios/ <%= meta.reverseDomain %>.<%= meta.projectName %> <%= meta.projectName %>',
        stdout: true,
        execOptions: {
            cwd: phonegapLib
        }
      },
      createAndroid: {
        command: './android/bin/create <%= meta.location %>/android/ <%= meta.reverseDomain %>.<%= meta.projectName %> <%= meta.projectName %>',
        stdout: true,
        execOptions: {
            cwd: phonegapLib
        }
      }
    },

    clean: {
      boiler: ['boiler/**/*'],
      iOS: ['ios/www/*'],              /* clean iOS webroot */
      android: ['android/assets/www/*' ]   /* clean android webroot */
    },

    /* phonegap cli bridge - iOS */
    iOS: {
      emulate: {
        bin: 'emulate'
      },
      debug: {
        bin: 'debug'
      },
      log: {
        bin: 'log'
      }
    },

    /* phonegap cli bridge - Android */
    android: {
      emulate: {
        bin: 'emulate'
      },
      debug: {
        bin: 'debug'
      },
      log: {
        bin: 'log'
      },
      clean: {
        bin: 'clean'
      },
      BOOM: {
        bin: 'BOOM'
      }
    },

    copy: {
      /* common client */
      boilClient: {
        options: { basePath: "www/client" },
        files: {
          "boiler/src/": ["www/client/**/*"]
        }
      },
      /* specific iOS */
      boilIOS: {
        options: { basePath: "www/iOS" },
        files: {
          "boiler/src/": ["www/iOS/**/*"]
        }
      },
      /* specific Android */
      boilAndroid: {
        options: { basePath: "www/android" },
        files: {
          "boiler/src/": ["www/android/**/*"]
        }
      },

      /* copy assets to dist */
      srcToDist: {
        options: { basePath: "boiler/src"},
        files: {
          "boiler/dist/": [
            "boiler/src/assets/img/**/*",
            "boiler/src/assets/js/libs/cordova-2.2.0.js"
        ]}
      },
      genToDist: {
        options: { basePath: "boiler/gen"},
        files: {
          "boiler/dist/": [
            "boiler/gen/index.html"
        ]}
      },

      /* release iOS */
      distToIOS: {
        options: { basePath: "boiler/dist" },
        files: {
          "ios/www/": ["boiler/dist/**/*"]
        }
      },
      /* release Android*/
      distToAndroid: {
        options: { basePath: "boiler/dist" },
        files: {
          "android/assets/www/": ["boiler/dist/**/*"]
        }
      }
    },

    /* build the webproject 
    * Templates: jade -> handlebars -> JST
    * Stylesheet: stylus -> mincss -> one css
    * Javascript: app -> requirejs -> concat -> one js
    */
    jade: {
      compile: {
        options: { },
        files: {
          "boiler/src/assets/templates/*.html": ["boiler/src/app/modules/**/*.jade"]
        }
      },
      debugIndex: {
        options: {
          data: {
            options: { debug: true }
          }
        },
        files: {
          "boiler/src/index.html": ["boiler/src/index.jade"]
        }
      },
      releaseIndex: {
        options: {
          data: {
            options: { debug: false }
          }
        },
        files: {
          "boiler/gen/index.html": ["boiler/src/index.jade"]
        }
      }
    },

    stylus: {
      compile: {
        options: {
          // paths: ['path/to/import', 'another/to/import'],
          // urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
          // use: [
          //   require('fluidity') // use stylus plugin at compile time
          // ]
        },
        files: {
          "boiler/src/assets/css/main.css": [
            "boiler/src/stylus/main.styl"//"client/stylus/**/*.styl"
          ]}
      }
    },

    handlebars: {
      compile: {
        options: {
          processName: function(filename) {
            var pieces = filename.split("/");
            return pieces[pieces.length - 1].replace('.html', '');
          }
          //namespace: "JST"
        },
        files: {
          "boiler/gen/templates.js": [
            "boiler/src/assets/templates/*.html"
          ]
        }
      }
    },

    requirejs: {
      compile: {
        options: {
          //baseUrl: "path/to/base",
          mainConfigFile: "boiler/src/app/config.js",
          out: "boiler/gen/require.js",
          name: "config",
          wrap: false
        }
      }
    },

    concat: {
      "boiler/dist/assets/js/app.js": [
        "boiler/src/assets/js/libs/almond.js",
        "boiler/gen/templates.js",
        "boiler/gen/require.js"
      ]
    },

    mincss: {
      compress: {
        files: {
          "boiler/dist/assets/css/index.css": [
            "boiler/src/assets/css/cordova.css",
            "boiler/src/assets/css/main.css"
          ]
        }
      }
    },


    // // Running debug/preview server
    server: {
      //root: "boiler/src/",
      index: "boiler/src/index.html",
      // files: { "index.html": "boiler/src/index.html" },

      folders: {
          "assets": "boiler/src/assets",
          "app": "boiler/src/app"
      },

      release: {
        // These two options make it easier for deploying, by using whatever
        // PORT is available in the environment and defaulting to any IP.
        host: "0.0.0.0",
        port: process.env.PORT || 8000,

        index: "boiler/dist/index.html",
        // files: { "index.html": "boiler/src/index.html" },

        folders: {
            "assets": "boiler/dist/assets"
        }
      }
    }

  });

  grunt.registerTask('iOS:init', 'shell:createIOS');
  grunt.registerTask('iOS:boil', 'clean:boiler copy:boilClient copy:boilIOS stylus jade handlebars requirejs concat mincss copy:srcToDist copy:genToDist');
  grunt.registerTask('iOS:build', 'clean:iOS iOS:boil copy:distToIOS iOS:debug');

  grunt.registerTask('android:init', 'shell:createAndroid');
  grunt.registerTask('android:boil', 'clean:boiler copy:boilClient copy:boilAndroid stylus jade handlebars requirejs concat mincss copy:srcToDist copy:genToDist');
  grunt.registerTask('android:build', 'android:clean clean:android android:boil copy:distToAndroid android:debug');
 
  grunt.registerTask('build', 'iOS:build android:build');

};
