import os

path = '~/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin'

JS = Builder(action = 'uglifyjs < $SOURCE > $TARGET',
             suffix = '.min.js',
             src_suffix = '.js')

env = Environment(
    BUILDERS = { 'Uglify' : JS },
    ENV = {
        'NODE_PATH': os.environ['NODE_PATH'],
        'PATH': path
        },
    EXPORTDIR = '#export'
    )

Export('env')
SConscript('src/SConscript', variant_dir = 'build', duplicate = 0)
