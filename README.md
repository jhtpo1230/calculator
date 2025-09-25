# calculator

## 데브코스 2차 과제 - 계산기 구현
<img width="327" height="613" alt="image" src="https://github.com/user-attachments/assets/ec3e2895-c4cb-4db2-9a42-4df7b4d31d13" />

---
### HTML 구조 파악

- 7행4열 -위의 2행은 경계선이 없음
   - AC 부분은 병합되어있는 모습(colspan)
   - 가장 위의 줄은 display
   - 2열은 textbox

- 사용할 태그
   - table, tr(테이블 행),td(행에 들어가는 데이터 셀)
   - <button type="button"> => input type보다 이게 좀 더 최신버전이라고 함
   - 병합시에 사용해야 하는 것 <td colspan="n">
   - 기호 css 나타내기 : <(=backspace) == \&lt; / x == \&times; / &#247; == \&divides;
---
### CSS
- 위의 2행은 회색컬러, 4열은 주황색 컬러에 text-color: white
- 현재 넓이 412px, 높이 784px => 웹 브라우저 크기에 맞춰서 적당한 크기로 바꾸기
- 사용할 코드
   - margin: 바깥여백
   - border: 테두리
   - padding: 안쪽여백
   - border-collapse: collapse; 선 겹침 제거
   - border-radius : n px; 모서리 라운드
- 참고할 코드
   - .클래스{} #아이디{}
   - tr:nth-child(n) td {} //n행
   - tr:last-child 마지막 행
   - td:first-child 1열
   - td:last-child 마지막 열
