module.exports = function (grunt) 
{
  
    /**
     * Configuration
     */

    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * Homepage: <%= pkg.homepage %>\n' +
            ' * Copyright 2014-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' * Based on Bootswatch (http://bootswatch.com/)\n' +
            '*/\n',
        
        dir: {
            themes: "./themes",
            build_assets: "./assets",
            html_assets: "../../assets",
            source: "./src"            
        },

        themes: grunt.file.readJSON('themes.json'),
        
        clean: {
            build: {
                src: []
            }
        },

        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: false
            },
            dist: {
                src: [],
                dest: ''
            }
        },
            
        uglify: {
            bootstrap: {
                files: {
                    '<%= dir.build_assets %>/js/bootstrap.min.js': [                        
                        '<%= dir.source %>/js/bootstrap/transition.js',
                        '<%= dir.source %>/js/bootstrap/alert.js',
                        '<%= dir.source %>/js/bootstrap/button.js',
                        '<%= dir.source %>/js/bootstrap/carousel.js',
                        '<%= dir.source %>/js/bootstrap/collapse.js',
                        '<%= dir.source %>/js/bootstrap/dropdown.js',
                        '<%= dir.source %>/js/bootstrap/modal.js',
                        '<%= dir.source %>/js/bootstrap/tooltip.js',
                        '<%= dir.source %>/js/bootstrap/popover.js',
                        '<%= dir.source %>/js/bootstrap/scrollspy.js',
                        '<%= dir.source %>/js/bootstrap/tab.js',
                        '<%= dir.source %>/js/bootstrap/affix.js'
                    ],
                    '<%= dir.build_assets %>/js/jquery-2.1.0.min.js': [                        
                        '<%= dir.source %>/js/jquery-2.1.0.js'
                    ]

                }
            }
        },

        sass: {
            dist: {
                files: {}
            }     
        },

        watch: {},

        preprocess : {
            
            html : {
                src :  '<%=dir.themes%>/global/index.html',
                dest : '<%=dir.themes%>/yeti/index.html',

                options : {
                    context : {
                        title : 'POTASSO-TITLE',
                        description : 'POTASSO_DESCRIPTION'
                    }
                }
            }
        }
    });

    /**
     * Load Tasks
     */

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-preprocess');
       
    /**
     * Register Custom Tasks
     */

    /**
     * Build task
     * @param theme
     */
    grunt.registerTask('build', 'build a regular theme', function(theme) {

        var concatSrc;
        var concatDest;
        var sassDest;
        var sassSrc;
        var files = {};
        var dist = {};

        // global build.scss
        concatSrc  = '<%=dir.themes%>/global/build.scss';
        
        // dis for build.scss
        concatDest = '<%=dir.themes%>/' + theme + '/build.scss';

        // sass from build.scss
        sassSrc    = [ '<%=dir.themes%>/' + theme + '/' + 'build.scss' ];

        // sass to bootstrap.css
        sassDest   = '<%=dir.themes%>/' + theme + '/bootstrap.css';
       
        // concat
        dist = {src: concatSrc, dest: concatDest};
        grunt.config('concat.dist', dist);
        
        //files
        files = {}; files[sassDest] = sassSrc;

        //sass
        grunt.config('sass.dist.files', files);

        //clean
        grunt.config('clean.build.src', [sassSrc]);

        //get theme attributes
        var theme_attrs = grunt.config.get('themes.' + theme);
        
        //preprocess index.html
        var preprocess_config = {};
        preprocess_config[theme] = {
            src :  '<%=dir.themes%>/global/index.html',
            dest : '<%=dir.themes%>/' + theme + '/index.html',

            options : {
                context : {
                    title : theme_attrs.title,
                    description : theme_attrs.description,
                    assets_dir: "<%= dir.html_assets %>"
                }
            }
        }

        // configure preprocess
        grunt.config('preprocess', preprocess_config);

        // runs tasks
        grunt.task.run(['concat', 'sass:dist', 'clean:build', 'preprocess:'+theme]);
    });
    
    /**
     * Run build task for every theme on themes object
     */
    grunt.registerMultiTask('themes', 'build a theme', function() {
        var theme = this.target;
        grunt.task.run('build:' + theme);
    });

    /**
     * Set themes task as default
     */
    grunt.registerTask('default', 'build a theme', function() {
        grunt.task.run('uglify');
        grunt.task.run('themes');
    });

    /**
     * Watch all themes
     */
    grunt.registerTask('watch-themes', 'watch all themes', function() {
        
        var watch_config = {};
        
        //get all themes
        var themes = grunt.config.get('themes');
              
        // set configurations on watch object
        for(var theme in themes)
        {
            watch_config[theme] = {
                files: ['<%=dir.themes%>/' + theme + '/*.scss'],
                tasks: ['build:'+theme]
            };
        }
        
        // configure watch task
        grunt.config('watch', watch_config);

        //run watch task
        grunt.task.run('watch');
    });

    /**
     * Test
     */
    grunt.registerTask('test', 'test function', function() {
    });
};
