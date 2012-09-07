# Kills Chrome
# http://www.commandlinefu.com/commands/view/1138/ps-ef-grep-process-grep-v-grep-awk-print-2-xargs-kill-9
ps aux | grep xinit.*chrome | awk '{print $2}' | xargs kill
