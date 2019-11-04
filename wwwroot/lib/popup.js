      $(document).on('opening', '.remodal', function () {
        console.log('opening');
      });

      $(document).on('opened', '.remodal', function () {
        console.log('opened');
      });

      $(document).on('closing', '.remodal', function (e) {
        console.log('closing' + (e.reason ? ', reason: ' + e.reason : ''));
      });

      $(document).on('closed', '.remodal', function (e) {
        console.log('closed' + (e.reason ? ', reason: ' + e.reason : ''));
      });

      $(document).on('confirmation', '.remodal', function () {
        console.log('confirmation');
      });

      $(document).on('cancellation', '.remodal', function () {
        console.log('cancellation');
      });

      $('[data-remodal-id=modal2]').remodal({
        modifier: 'with-red-theme'
      });


      