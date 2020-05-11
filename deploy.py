#!/usr/local/bin/python3

import os
import shutil
import sys

def print_usage(valid_env):
    print('Usage: ./deploy.py [%s]\n' % '|'.join(valid_env))

def main():
    valid_env = ["staging", "production"]

    if len(sys.argv) < 2:
        print_usage(valid_env)
        exit(1)

    env = sys.argv[1]
    if env not in valid_env:
        print_usage(valid_env)
        exit(1)

    os.system("yarn build:%s" % env)
    shutil.make_archive("build-web", 'zip', "build")
    os.system("scp build-web.zip tpktcds@18.136.199.101:/home/tpktcds/")
    os.system('ssh tpktcds@18.136.199.101 "cd script;sh publish-web-static.sh"')

if __name__ == '__main__':
    main()