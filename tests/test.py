import eventlet

q = eventlet.queue.Queue(0)

def p1(q, k):
    for i in range(1,k+1):
        print '>putting', i
        q.put(i)
        print '<done putting'
        
def p2(q,k,m):
    for i in range(1,k+1):
        print m, 'calling get'
        print '(%s/%s) *** %s' % (m, i, q.get())
    print 'exiting', m

eventlet.spawn(p1, q, 20)
eventlet.spawn(p2, q, 10, 1)
eventlet.spawn(p2, q, 10, 2)
eventlet.sleep(10)