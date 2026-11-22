set -e
T="$1"
bash toadmin.sh
for i in 1 2 3; do python3 ap.py swipe down >/dev/null; done
python3 tapbtn.py "+ הוספת קטע כאן" >/dev/null; sleep 3
python3 setf.py 0 "$T"
python3 setf.py 0 "קטע בדיקה למחיקה עם הקראה" XCUIElementTypeTextView
for i in 1 2; do python3 ap.py swipe up >/dev/null; done
python3 setf.py 6 "בודק QA"
python3 tapbtn.py "אישור ופרסום"; sleep 5
python3 tapbtn.py "אישור"; sleep 3
