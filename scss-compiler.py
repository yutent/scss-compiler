import sublime
import sublime_plugin
import subprocess
import re
import os


def get_setting(key, default=None):

    settings = sublime.load_settings('ScssCompiler.sublime-settings')
    os_specific_settings = {}

    return os_specific_settings.get(key, settings.get(key, default))


def compile_scss(scss_file): 

    shoud_compress = get_setting('compress_on_compile')

    compile_style = get_setting('compile_style')

    sourcemap = get_setting('sourcemap')


    args = ['scss', '-C', '-t']
    
    if shoud_compress:
        args.append('compressed')
    else:
        args.append(compile_style)

    if sourcemap:
        args.append('--sourcemap=auto')
    else:
        args.append('--sourcemap=none')

    args.append(scss_file)
    
    cssfile = scss_file[0:-4] + 'css'
    
    args.append(cssfile)

    pipe = subprocess.Popen(args, stderr=subprocess.PIPE)
    (out, err) = pipe.communicate()
    return err.decode('utf-8')
    


class ScssCompiler(sublime_plugin.EventListener):
    def on_post_save(self, view):

        shoud_compile = get_setting('compile_on_save')
        scss_file = view.file_name()

        if not shoud_compile: 
            return

        if not re.search(r'\.scss$', scss_file): 
            return 

        if os.path.basename(scss_file) == 'var.scss': 
            return 
        
        err_msg = compile_scss(scss_file)

        if err_msg: 
            view.show_popup(err_msg)


class __CompilerCommand(): 
    def get_path(self, paths): 
        if paths: 
            return paths[0]
        elif self.window.active_view() and self.window.active_view().file_name(): 
            return self.window.active_view().file_name()
        elif self.window.folders(): 
            return self.window.folders()
        else:
            sublime.error_message('No scss file to Compile...')
            return False


class CompileScssCommand(sublime_plugin.WindowCommand, __CompilerCommand): 

    def run(self, paths=[]): 

        path = self.get_path(paths)
        if not path: 
            return 

        print(path)

        if not re.search(r'\.scss$', path): 
            sublime.error_message('This is not a scss file ...')
            return 

        compile_scss(path)
        