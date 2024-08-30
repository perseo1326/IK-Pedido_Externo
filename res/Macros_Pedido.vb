Sub borrar_ceros()
'
' borrar_ceros Macro
' Borra las celdas sin datos
'

'
    Sheets("Pedir").Select
    Selection.AutoFilter
    Selection.AutoFilter
    ActiveSheet.Range("$A$1:$U$1200").AutoFilter Field:=15, Criteria1:="0"
    Range("A656:U656").Select
    Range(Selection, Selection.End(xlDown)).Select
    Range(Selection, Selection.End(xlDown)).Select
    Selection.ClearContents
    Range("A1").Select
    ActiveSheet.Range("$A$1:$U$1200").AutoFilter Field:=15
    Range("A1").Select
    ActiveWorkbook.Worksheets("Pedir").AutoFilter.Sort.SortFields.Clear
    ActiveWorkbook.Worksheets("Pedir").AutoFilter.Sort.SortFields.Add2 Key:=Range _
        ("G1:G1200"), SortOn:=xlSortOnValues, Order:=xlAscending, DataOption:= _
        xlSortNormal
    With ActiveWorkbook.Worksheets("Pedir").AutoFilter.Sort
        .Header = xlYes
        .MatchCase = False
        .Orientation = xlTopToBottom
        .SortMethod = xlPinYin
        .Apply
    End With
End Sub
